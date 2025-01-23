// TensorFlow.js MobileNet 模型
let localModel = null;

// 初始化本地模型
async function initLocalModel() {
    try {
        localModel = await mobilenet.load();
        console.log('本地模型加载成功');
    } catch (error) {
        console.error('本地模型加载失败:', error);
    }
}

// 本地图像预处理
async function preprocessImage(imageData) {
    const img = new Image();
    img.src = imageData;
    await new Promise(resolve => img.onload = resolve);

    // 创建canvas进行图像处理
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 调整图像大小
    const size = 224; // MobileNet 期望的输入大小
    canvas.width = size;
    canvas.height = size;
    
    // 图像增强
    ctx.drawImage(img, 0, 0, size, size);
    
    // 应用图像增强
    const imageData = ctx.getImageData(0, 0, size, size);
    const enhancedData = enhanceImage(imageData);
    ctx.putImageData(enhancedData, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.9);
}

// 图像增强函数
function enhanceImage(imageData) {
    const data = imageData.data;
    
    // 应用对比度和亮度调整
    for (let i = 0; i < data.length; i += 4) {
        // 提高对比度
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));
        data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.2 + 128));
        data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.2 + 128));
    }
    
    return imageData;
}

// 使用本地模型进行预测
async function localPredict(imageData) {
    if (!localModel) {
        await initLocalModel();
    }
    
    const img = new Image();
    img.src = imageData;
    await new Promise(resolve => img.onload = resolve);
    
    const predictions = await localModel.classify(img, 5);
    return predictions.map(p => ({
        name: p.className,
        value: p.probability
    }));
} 