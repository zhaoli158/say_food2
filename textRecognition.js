// 文字识别相关的DOM元素
const textVideo = document.getElementById('textVideo');
const textCanvas = document.getElementById('textCanvas');
const textPreview = document.getElementById('textPreview');
const takeTextPhotoBtn = document.getElementById('takeTextPhoto');
const uploadTextPhotoBtn = document.getElementById('uploadTextPhoto');
const textFileInput = document.getElementById('textFileInput');
const textResult = document.getElementById('textResult');

// 初始化Tesseract
const worker = Tesseract.createWorker({
    logger: message => {
        if (message.status === 'recognizing text') {
            textResult.innerHTML = `
                <div class="loading-state">
                    ${loadingSvg}
                    <div>正在识别中... ${Math.round(message.progress * 100)}%</div>
                </div>
            `;
        }
    }
});

// 初始化文字识别
async function initTextRecognition() {
    await worker.load();
    await worker.loadLanguage('chi_sim+eng');
    await worker.initialize('chi_sim+eng');
}

// 初始化
initTextRecognition();

// 文字识别函数
async function recognizeText(imageData) {
    try {
        textResult.innerHTML = `
            <div class="loading-state">
                ${loadingSvg}
                <div>正在识别中...</div>
            </div>
        `;

        const { data: { text } } = await worker.recognize(imageData);
        
        // 处理识别结果
        const formattedText = text.trim();
        if (formattedText) {
            textResult.innerHTML = `
                <div class="text-result">
                    <h3>识别结果：</h3>
                    <div class="recognized-text">${formattedText}</div>
                    <button class="copy-btn" onclick="copyText('${formattedText.replace(/'/g, "\\'")}')">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                        </svg>
                        复制文本
                    </button>
                </div>
            `;
        } else {
            textResult.innerHTML = `
                <div class="error-message">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                    </svg>
                    <span>未能识别出文字，请尝试：</span>
                    <ul>
                        <li>确保图片清晰度足够</li>
                        <li>调整拍摄角度</li>
                        <li>确保光线充足</li>
                        <li>避免复杂背景</li>
                    </ul>
                </div>
            `;
        }
    } catch (error) {
        console.error('文字识别失败:', error);
        textResult.innerHTML = `
            <div class="error-message">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                </svg>
                <span>识别失败: ${error.message}</span>
                <button onclick="retryTextRecognition()" class="retry-btn">重试</button>
            </div>
        `;
    }
}

// 复制文本
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
            </svg>
            已复制
        `;
        setTimeout(() => {
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
                复制文本
            `;
        }, 2000);
    });
}

// 界面切换函数
function showSelectionScreen() {
    document.getElementById('selectionScreen').style.display = 'block';
    document.getElementById('textRecognitionScreen').style.display = 'none';
    document.getElementById('foodRecognitionScreen').style.display = 'none';
}

function showTextRecognition() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('textRecognitionScreen').style.display = 'block';
    document.getElementById('foodRecognitionScreen').style.display = 'none';
    
    // 添加动画类
    setTimeout(() => {
        document.getElementById('textRecognitionScreen').classList.add('active');
    }, 10);
}

function showFoodRecognition() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('textRecognitionScreen').style.display = 'none';
    document.getElementById('foodRecognitionScreen').style.display = 'block';
    
    // 添加动画类
    setTimeout(() => {
        document.getElementById('foodRecognitionScreen').classList.add('active');
    }, 10);
}

// 事件监听器
takeTextPhotoBtn.addEventListener('click', () => {
    if (textVideo.style.display === 'none') {
        initCamera();
    } else {
        textCanvas.width = textVideo.videoWidth;
        textCanvas.height = textVideo.videoHeight;
        textCanvas.getContext('2d').drawImage(textVideo, 0, 0);
        textPreview.src = textCanvas.toDataURL('image/jpeg');
        textPreview.style.display = 'block';
        textVideo.style.display = 'none';
        
        recognizeText(textPreview.src);
    }
});

uploadTextPhotoBtn.addEventListener('click', () => {
    textFileInput.click();
});

textFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            textPreview.src = e.target.result;
            textPreview.style.display = 'block';
            textVideo.style.display = 'none';
            
            recognizeText(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}); 