// 获取DOM元素
let preview, uploadPhotoBtn, fileInput, result;

// 更新 Clarifai API 配置
const CLARIFAI_API_KEY = 'YOUR_API_KEY';
const MODELS = {
    FOOD: 'food-item-recognition',
    GENERAL: 'general-image-recognition',
    FOOD_INGREDIENTS: 'food-ingredients-recognition'
};

// 添加特定食物关键词
const SPECIFIC_FOODS = {
    chocolate: {
        keywords: ['chocolate', 'cocoa', 'dark chocolate', 'milk chocolate', 'candy bar', 'chocolate bar', '巧克力', '可可'],
        confidence_boost: 1.2,  // 提高置信度
        visual_features: {
            color_range: {
                r: [60, 100],  // 巧克力的红色范围
                g: [30, 70],   // 巧克力的绿色范围
                b: [0, 40]     // 巧克力的蓝色范围
            },
            texture: 'smooth'  // 表面质地特征
        }
    },
    // 可以添加其他特定食物...
};

// 初始化事件监听
function initializeEventListeners() {
    console.log('开始初始化事件监听器...');

    // 获取DOM元素
    preview = document.getElementById('preview');
    uploadPhotoBtn = document.getElementById('uploadPhoto');
    fileInput = document.getElementById('fileInput');
    result = document.getElementById('result');

    // 检查所有必要的DOM元素
    if (!preview || !uploadPhotoBtn || !fileInput || !result) {
        console.error('找不到必要的DOM元素:', {
            preview: !!preview,
            uploadPhotoBtn: !!uploadPhotoBtn,
            fileInput: !!fileInput,
            result: !!result
        });
        return;
    }

    // 移除可能存在的旧事件监听器
    uploadPhotoBtn.replaceWith(uploadPhotoBtn.cloneNode(true));
    fileInput.replaceWith(fileInput.cloneNode(true));

    // 重新获取新的元素引用
    uploadPhotoBtn = document.getElementById('uploadPhoto');
    fileInput = document.getElementById('fileInput');

    console.log('正在添加事件监听器...');

    // 上传图片按钮事件
    uploadPhotoBtn.addEventListener('click', () => {
        console.log('上传按钮被点击');
        fileInput.click();
    });

    // 文件选择事件
    fileInput.addEventListener('change', (e) => {
        console.log('文件被选择');
        const file = e.target.files[0];
        if (file) {
            console.log('处理文件:', file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                
                // 识别图片
                analyzeImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    console.log('事件监听器添加完成');
}

// 分析图片
async function analyzeImage(imageData) {
    if (!result) return;

    result.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <div>正在识别中...</div>
        </div>
    `;
    result.className = 'loading-state';

    try {
        // 检查网络连接
        const isOnline = navigator.onLine;
        document.getElementById('offlineMode').style.display = isOnline ? 'none' : 'block';
        
        let results;
        
        if (isOnline) {
            // 并行调用多个模型
            results = await Promise.all([
                predictWithModel(imageData.split(',')[1], MODELS.FOOD),
                predictWithModel(imageData.split(',')[1], MODELS.GENERAL),
                predictWithModel(imageData.split(',')[1], MODELS.FOOD_INGREDIENTS)
            ]);
        } else {
            // 使用本地模型
            results = [
                await localPredict(imageData),
                [],  // 离线模式下没有通用识别结果
                []   // 离线模式下没有食材识别结果
            ];
        }

        // 合并和处理结果
        const [foodResults, generalResults, ingredientResults] = results;
        
        // 查询本地数据库获取相似案例
        const similarCases = await Promise.all(
            foodResults.slice(0, 3).map(result => 
                foodDB.getSimilarCases(result.name)
            )
        );
        
        // 综合分析结果
        const combinedResults = analyzeResults(foodResults, generalResults, ingredientResults, similarCases);
        
        if (combinedResults.isFood) {
            displayFoodResults(combinedResults);
            // 显示反馈面板
            document.getElementById('feedbackPanel').style.display = 'block';
        } else {
            displayNonFoodMessage();
        }
        
        // 保存历史记录
        await foodDB.saveHistory(imageData, combinedResults);
        
    } catch (error) {
        handleError(error);
    }
}

// 使用特定模型预测
async function predictWithModel(base64Data, modelId) {
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": "clarifai",
            "app_id": "main"
        },
        "inputs": [{
            "data": {
                "image": { "base64": base64Data }
            }
        }],
        "model": {
            "output_info": {
                "output_config": {
                    "min_value": 0.50,
                    "max_concepts": 10
                }
            }
        }
    });

    const response = await fetch(
        `https://api.clarifai.com/v2/models/${modelId}/outputs`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Key ${CLARIFAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: raw
        }
    );

    const data = await response.json();
    if (data.status.code !== 10000) {
        throw new Error(data.status.description);
    }
    
    return data.outputs[0].data.concepts;
}

// 分析组合结果
function analyzeResults(foodResults, generalResults, ingredientResults, similarCases) {
    // 食物相关关键词
    const foodKeywords = ['food', 'dish', 'meal', 'cuisine', 'edible'];
    
    // 计算是否为食物的综合得分
    const isGeneralFood = generalResults.some(concept => 
        foodKeywords.some(keyword => 
            concept.name.toLowerCase().includes(keyword) && concept.value > 0.8
        )
    );

    // 获取高置信度的食物识别结果
    const highConfidenceFoods = foodResults.filter(concept => concept.value > 0.7);
    
    // 获取主要食材
    const mainIngredients = ingredientResults
        .filter(concept => concept.value > 0.6)
        .slice(0, 3);

    // 添加特定食物识别
    const enhancedResults = enhanceSpecificFoodRecognition(foodResults, imageData);
    
    return {
        isFood: isGeneralFood || enhancedResults.length > 0,
        foods: enhancedResults.length > 0 ? enhancedResults : highConfidenceFoods,
        ingredients: mainIngredients,
        generalConcepts: generalResults.filter(concept => concept.value > 0.9),
        similarCases: similarCases
    };
}

// 特定食物识别增强
function enhanceSpecificFoodRecognition(results, imageData) {
    const enhancedResults = [...results];
    
    // 分析图像特征
    const imageFeatures = analyzeImageFeatures(imageData);
    
    // 检查每个特定食物类别
    for (const [foodType, features] of Object.entries(SPECIFIC_FOODS)) {
        // 检查关键词匹配
        const matchingResults = results.filter(result => 
            features.keywords.some(keyword => 
                result.name.toLowerCase().includes(keyword.toLowerCase())
            )
        );

        if (matchingResults.length > 0) {
            // 检查颜色特征是否匹配
            if (checkColorMatch(imageFeatures.colors, features.visual_features.color_range)) {
                // 提高置信度
                matchingResults.forEach(result => {
                    result.value *= features.confidence_boost;
                });
            }
        }
    }

    return enhancedResults.sort((a, b) => b.value - a.value);
}

// 分析图像特征
function analyzeImageFeatures(imageData) {
    const img = new Image();
    img.src = imageData;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // 计算平均颜色
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }
    
    const pixelCount = data.length / 4;
    return {
        colors: {
            r: Math.round(r / pixelCount),
            g: Math.round(g / pixelCount),
            b: Math.round(b / pixelCount)
        }
    };
}

// 检查颜色是否匹配
function checkColorMatch(imageColors, targetRange) {
    return (
        imageColors.r >= targetRange.r[0] && imageColors.r <= targetRange.r[1] &&
        imageColors.g >= targetRange.g[0] && imageColors.g <= targetRange.g[1] &&
        imageColors.b >= targetRange.b[0] && imageColors.b <= targetRange.b[1]
    );
}

// 显示食物识别结果
function displayFoodResults(results) {
    const { foods, ingredients, generalConcepts, similarCases } = results;
    
    const foodsHtml = foods.map(createResultItemHtml).join('');
    const ingredientsHtml = ingredients.map(ingredient => 
        `<span class="ingredient-tag">${ingredient.name}</span>`
    ).join('');

    result.innerHTML = `
        <div class="results-container">
            <h3>识别结果：</h3>
            <div class="food-results">
                ${foodsHtml}
            </div>
            ${ingredients.length > 0 ? `
                <div class="ingredients-section">
                    <h4>主要食材：</h4>
                    <div class="ingredients-tags">
                        ${ingredientsHtml}
                    </div>
                </div>
            ` : ''}
            <div class="additional-info">
                <p class="info-text">置信度：${Math.round(foods[0]?.value * 100)}%</p>
                <p class="info-text">分类：${generalConcepts[0]?.name || '未知'}</p>
            </div>
        </div>
    `;
    result.className = 'success';
}

// 创建结果项HTML
function createResultItemHtml(concept) {
    const percentage = Math.round(concept.value * 100);
    const confidenceClass = percentage > 90 ? 'high-confidence' : 
                          percentage > 70 ? 'medium-confidence' : 
                          'low-confidence';
    
    return `
        <div class="result-item ${confidenceClass}">
            <span class="food-name">${concept.name}</span>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${percentage}%"></div>
                <span class="confidence-text">${percentage}%</span>
            </div>
        </div>
    `;
}

// 显示非食物信息
function displayNonFoodMessage() {
    result.innerHTML = `
        <div class="error-message">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            <span>这可能不是食物，或者我无法准确识别。请尝试:</span>
            <ul>
                <li>确保图片清晰度足够</li>
                <li>调整拍摄角度</li>
                <li>确保光线充足</li>
                <li>尽量对准单个食物</li>
            </ul>
        </div>
    `;
    result.className = 'error';
}

// 处理错误
function handleError(error) {
    console.error('识别失败:', error);
    result.innerHTML = `
        <div class="error-message">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            <span>识别失败: ${error.message}</span>
            <button onclick="retryLastImage()" class="retry-btn">重试</button>
        </div>
    `;
    result.className = 'error';
}

// 添加重试功能
let lastImageData = null;

function retryLastImage() {
    if (lastImageData) {
        analyzeImage(lastImageData);
    }
}

// 导出函数供其他模块使用
window.initializeEventListeners = initializeEventListeners;