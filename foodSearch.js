// 分块加载食物数据库
const foodDatabase = {};

// 添加数据加载状态检查
let dataLoaded = false;

// 添加搜索结果缓存
const searchCache = new Map();

// 初始化完成后隐藏加载提示
function hideLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

async function loadFoodData() {
    try {
        // 只加载基础数据
        const basicFoods = {
            "米饭": {
                calories: 116,
                protein: 2.6,
                fat: 0.3,
                carbs: 25.9,
                fiber: 0.3,
                serving: "100g",
                description: "主食，碳水化合物的重要来源",
                glycemicIndex: 83,
                diabetesFriendly: false,
                healthTips: "高血糖人群不宜多食，建议搭配蔬菜食用，可选择糙米代替",
                vitamins: {
                    "维生素B1": "0.02mg",
                    "维生素B2": "0.01mg"
                },
                minerals: {
                    "钾": "29mg",
                    "钙": "3mg",
                    "铁": "0.2mg"
                }
            },
            "糙米饭": {
                calories: 111,
                protein: 2.3,
                fat: 0.8,
                carbs: 23.5,
                fiber: 1.8,
                serving: "100g",
                description: "全谷物，含有丰富的膳食纤维和B族维生素",
                glycemicIndex: 55,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，富含膳食纤维，升糖指数较低",
                vitamins: {
                    "维生素B1": "0.15mg",
                    "维生素B2": "0.03mg",
                    "维生素E": "0.9mg"
                },
                minerals: {
                    "钾": "79mg",
                    "钙": "10mg",
                    "铁": "0.5mg",
                    "锌": "0.8mg"
                }
            },
            "面包": {
                calories: 265,
                protein: 9,
                fat: 3.2,
                carbs: 49,
                fiber: 2.7,
                serving: "100g",
                description: "富含碳水化合物和蛋白质的主食",
                glycemicIndex: 75,
                diabetesFriendly: false,
                healthTips: "高血糖人群应当限量食用，建议选择全麦面包",
                vitamins: {
                    "维生素B1": "0.2mg",
                    "维生素B2": "0.1mg",
                    "维生素E": "0.6mg"
                },
                minerals: {
                    "钾": "130mg",
                    "钙": "15mg",
                    "铁": "1.8mg"
                }
            },
            "全麦面包": {
                calories: 247,
                protein: 13,
                fat: 3.5,
                carbs: 41,
                fiber: 7,
                serving: "100g",
                description: "全谷物制品，富含膳食纤维和蛋白质",
                glycemicIndex: 54,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，建议搭配蛋白质食用",
                vitamins: {
                    "维生素B1": "0.4mg",
                    "维生素B2": "0.2mg",
                    "维生素E": "1.2mg",
                    "叶酸": "50μg"
                },
                minerals: {
                    "钾": "250mg",
                    "钙": "30mg",
                    "铁": "2.5mg",
                    "锌": "2mg"
                }
            },
            "燕麦片": {
                calories: 389,
                protein: 16.9,
                fat: 6.9,
                carbs: 66.3,
                fiber: 10.6,
                serving: "100g",
                description: "全谷物，富含β-葡聚糖，有助于控制血糖",
                glycemicIndex: 55,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，建议早餐食用，可降低胆固醇",
                vitamins: {
                    "维生素B1": "0.76mg",
                    "维生素B6": "0.12mg",
                    "维生素E": "0.7mg"
                },
                minerals: {
                    "钾": "429mg",
                    "钙": "54mg",
                    "铁": "4.72mg",
                    "锌": "3.97mg"
                }
            },
            "红薯": {
                calories: 86,
                protein: 1.6,
                fat: 0.1,
                carbs: 20.1,
                fiber: 3,
                serving: "100g",
                description: "富含膳食纤维和胡萝卜素的健康主食",
                glycemicIndex: 54,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，升糖指数适中，富含膳食纤维",
                vitamins: {
                    "维生素A": "709μg",
                    "维生素C": "2.4mg",
                    "维生素B6": "0.3mg"
                },
                minerals: {
                    "钾": "337mg",
                    "镁": "25mg",
                    "铁": "0.7mg"
                }
            },
            "鸡胸肉": {
                calories: 165,
                protein: 31,
                fat: 3.6,
                carbs: 0,
                fiber: 0,
                serving: "100g",
                description: "优质蛋白质来源，脂肪含量低",
                glycemicIndex: 0,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，不含碳水化合物，富含优质蛋白质",
                vitamins: {
                    "维生素B6": "0.6mg",
                    "维生素B3": "13.7mg",
                    "维生素B12": "0.3μg"
                },
                minerals: {
                    "钾": "256mg",
                    "磷": "210mg",
                    "锌": "0.9mg"
                }
            },
            "豆腐": {
                calories: 76,
                protein: 8.1,
                fat: 4.8,
                carbs: 1.9,
                fiber: 0.3,
                serving: "100g",
                description: "植物蛋白质来源，含有异黄酮",
                glycemicIndex: 15,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，低升糖指数，富含植物蛋白",
                vitamins: {
                    "维生素B1": "0.08mg",
                    "维生素B2": "0.03mg",
                    "叶酸": "15μg"
                },
                minerals: {
                    "钙": "138mg",
                    "铁": "1.9mg",
                    "锌": "0.8mg"
                }
            },
            "香蕉": {
                calories: 89,
                protein: 1.1,
                fat: 0.3,
                carbs: 22.8,
                fiber: 2.6,
                serving: "100g",
                description: "富含钾和维生素B6的水果",
                glycemicIndex: 51,
                diabetesFriendly: false,
                healthTips: "血糖控制人群应适量食用，建议搭配蛋白质食用",
                vitamins: {
                    "维生素B6": "0.4mg",
                    "维生素C": "8.7mg",
                    "叶酸": "20μg"
                },
                minerals: {
                    "钾": "358mg",
                    "镁": "27mg",
                    "锰": "0.3mg"
                }
            },
            "核桃": {
                calories: 654,
                protein: 15.2,
                fat: 65.2,
                carbs: 13.7,
                fiber: 6.7,
                serving: "100g",
                description: "富含omega-3脂肪酸和抗氧化物质",
                glycemicIndex: 15,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，但需控制食用量，富含健康脂肪",
                vitamins: {
                    "维生素E": "0.7mg",
                    "维生素B1": "0.34mg",
                    "维生素B6": "0.54mg"
                },
                minerals: {
                    "镁": "158mg",
                    "磷": "346mg",
                    "锌": "3.09mg"
                }
            },
            "卷心菜": {
                calories: 25,
                protein: 1.3,
                fat: 0.2,
                carbs: 5.8,
                fiber: 2.5,
                serving: "100g",
                description: "低热量高纤维的十字花科蔬菜，富含维生素C和膳食纤维",
                vitamins: {
                    "维生素C": "36mg",
                    "维生素K": "76μg",
                    "叶酸": "43μg"
                },
                minerals: {
                    "钾": "170mg",
                    "钙": "40mg",
                    "铁": "0.5mg"
                }
            },
            "西兰花": {
                calories: 34,
                protein: 2.8,
                fat: 0.4,
                carbs: 7,
                fiber: 2.6,
                serving: "100g",
                description: "营养价值极高的十字花科蔬菜，富含维生素C和抗氧化物质",
                vitamins: {
                    "维生素C": "89.2mg",
                    "维生素K": "101.6μg",
                    "叶酸": "63μg"
                },
                minerals: {
                    "钾": "316mg",
                    "钙": "47mg",
                    "铁": "0.73mg"
                }
            },
            "菠菜": {
                calories: 23,
                protein: 2.9,
                fat: 0.4,
                carbs: 3.6,
                fiber: 2.2,
                serving: "100g",
                description: "富含铁质和叶酸的绿叶蔬菜",
                glycemicIndex: 15,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，富含膳食纤维和矿物质",
                vitamins: {
                    "维生素A": "469μg",
                    "维生素C": "28.1mg",
                    "叶酸": "194μg"
                },
                minerals: {
                    "铁": "2.71mg",
                    "钙": "99mg",
                    "镁": "79mg"
                }
            },
            "巧克力": {
                calories: 545,
                protein: 7.8,
                fat: 31.3,
                carbs: 57.8,
                fiber: 3.4,
                serving: "100g",
                description: "可可含量高的零食，富含抗氧化物质",
                glycemicIndex: 40,
                diabetesFriendly: false,
                healthTips: "血糖控制人群应限量食用，建议选择70%以上黑巧克力，每次限制在10-15g",
                vitamins: {
                    "维生素E": "0.59mg",
                    "维生素B1": "0.04mg",
                    "维生素B2": "0.08mg"
                },
                minerals: {
                    "铁": "2.4mg",
                    "镁": "146mg",
                    "锌": "2.3mg"
                }
            },
            "饼干": {
                calories: 435,
                protein: 7.5,
                fat: 12.5,
                carbs: 71.3,
                fiber: 2.4,
                serving: "100g",
                description: "常见的零食，主要由面粉和糖制成",
                glycemicIndex: 70,
                diabetesFriendly: false,
                healthTips: "血糖控制人群不宜食用，含糖量高，建议选择全麦饼干或粗粮饼干",
                vitamins: {
                    "维生素B1": "0.1mg",
                    "维生素B2": "0.1mg",
                    "维生素E": "1.4mg"
                },
                minerals: {
                    "钙": "56mg",
                    "铁": "2.7mg",
                    "钾": "150mg"
                }
            },
            "薯片": {
                calories: 536,
                protein: 7,
                fat: 35,
                carbs: 51,
                fiber: 4.4,
                serving: "100g",
                description: "油炸零食，含有大量脂肪和盐分",
                glycemicIndex: 60,
                diabetesFriendly: false,
                healthTips: "不建议血糖控制人群食用，含有大量反式脂肪和盐分",
                vitamins: {
                    "维生素C": "31.1mg",
                    "维生素B6": "0.4mg",
                    "维生素E": "4.2mg"
                },
                minerals: {
                    "钾": "1275mg",
                    "钠": "500mg",
                    "镁": "43mg"
                }
            },
            "果冻": {
                calories: 62,
                protein: 1,
                fat: 0,
                carbs: 14.5,
                fiber: 0,
                serving: "100g",
                description: "含糖果胶制成的零食",
                glycemicIndex: 65,
                diabetesFriendly: false,
                healthTips: "血糖控制人群不宜食用，纯糖类食品，升糖快",
                vitamins: {
                    "维生素C": "1mg"
                },
                minerals: {
                    "钙": "10mg",
                    "钾": "15mg"
                }
            },
            "坚果混合": {
                calories: 607,
                protein: 20,
                fat: 54,
                carbs: 17,
                fiber: 8.5,
                serving: "100g",
                description: "混合坚果，富含健康脂肪和蛋白质",
                glycemicIndex: 15,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，但需要控制食用量，建议每次15-30g",
                vitamins: {
                    "维生素E": "9.1mg",
                    "维生素B1": "0.4mg",
                    "维生素B6": "0.3mg"
                },
                minerals: {
                    "镁": "270mg",
                    "锌": "3.1mg",
                    "硒": "19.6μg"
                }
            },
            // 糖果类
            "棒棒糖": {
                calories: 393,
                protein: 0,
                fat: 0,
                carbs: 98.3,
                fiber: 0,
                serving: "100g",
                description: "纯糖类零食，主要由蔗糖制成",
                glycemicIndex: 70,
                diabetesFriendly: false,
                healthTips: "血糖控制人群禁止食用，纯糖类食品，升糖极快",
                vitamins: {},
                minerals: {}
            },
            // 膨化食品类
            "爆米花": {
                calories: 387,
                protein: 12.9,
                fat: 4.5,
                carbs: 77.9,
                fiber: 14.5,
                serving: "100g",
                description: "玉米膨化零食，可选择无糖版本",
                glycemicIndex: 55,
                diabetesFriendly: false,
                healthTips: "建议选择无糖版本，控制食用量，富含膳食纤维",
                vitamins: {
                    "维生素B1": "0.2mg",
                    "维生素B3": "2.6mg",
                    "维生素E": "0.3mg"
                },
                minerals: {
                    "铁": "2.1mg",
                    "镁": "144mg",
                    "锌": "2.8mg"
                }
            },
            // 饮料类
            "可乐": {
                calories: 42,
                protein: 0,
                fat: 0,
                carbs: 10.6,
                fiber: 0,
                serving: "100ml",
                description: "碳酸饮料，含有大量糖分和咖啡因",
                glycemicIndex: 63,
                diabetesFriendly: false,
                healthTips: "血糖控制人群禁止饮用，含糖量高，建议选择无糖版本",
                vitamins: {},
                minerals: {
                    "钠": "7mg",
                    "钾": "1mg"
                }
            },
            // 冰淇淋类
            "香草冰淇淋": {
                calories: 207,
                protein: 3.5,
                fat: 11,
                carbs: 23.6,
                fiber: 0.7,
                serving: "100g",
                description: "奶制品零食，含有乳糖和奶油",
                glycemicIndex: 61,
                diabetesFriendly: false,
                healthTips: "血糖控制人群应避免食用，含糖量高，可选择无糖冰淇淋",
                vitamins: {
                    "维生素A": "120μg",
                    "维生素D": "0.3μg",
                    "维生素B2": "0.2mg"
                },
                minerals: {
                    "钙": "128mg",
                    "磷": "105mg",
                    "钾": "199mg"
                }
            },
            // 甜点类
            "蛋糕": {
                calories: 257,
                protein: 5.2,
                fat: 11.5,
                carbs: 34.8,
                fiber: 0.9,
                serving: "100g",
                description: "面粉制品甜点，含有大量糖分和脂肪",
                glycemicIndex: 67,
                diabetesFriendly: false,
                healthTips: "血糖控制人群不宜食用，含糖量高，建议选择无糖或低糖版本",
                vitamins: {
                    "维生素A": "98μg",
                    "维生素E": "1.4mg",
                    "维生素B1": "0.1mg"
                },
                minerals: {
                    "钙": "83mg",
                    "铁": "1.6mg",
                    "钾": "138mg"
                }
            },
            // 饮品类 - 奶茶
            "奶茶": {
                calories: 186,
                protein: 2.8,
                fat: 6.2,
                carbs: 29.4,
                fiber: 0,
                serving: "100ml",
                description: "含糖茶饮，添加奶精和珍珠等配料",
                glycemicIndex: 68,
                diabetesFriendly: false,
                healthTips: "血糖控制人群不宜饮用，含糖量高，建议选择无糖茶饮",
                vitamins: {
                    "维生素B2": "0.1mg",
                    "维生素E": "0.2mg"
                },
                minerals: {
                    "钙": "65mg",
                    "钾": "98mg",
                    "钠": "42mg"
                }
            },
            "巧克力牛奶": {
                calories: 87,
                protein: 3.3,
                fat: 2.5,
                carbs: 12.8,
                fiber: 0.8,
                serving: "100ml",
                description: "添加可可粉的调味牛奶",
                glycemicIndex: 34,
                diabetesFriendly: false,
                healthTips: "血糖控制人群应限量饮用，建议选择无糖版本",
                vitamins: {
                    "维生素A": "51μg",
                    "维生素D": "0.4μg",
                    "维生素B2": "0.18mg"
                },
                minerals: {
                    "钙": "120mg",
                    "镁": "13mg",
                    "钾": "150mg"
                }
            },
            "橙汁": {
                calories: 45,
                protein: 0.7,
                fat: 0.2,
                carbs: 10.4,
                fiber: 0.2,
                serving: "100ml",
                description: "鲜榨橙子制成的果汁",
                glycemicIndex: 50,
                diabetesFriendly: false,
                healthTips: "血糖控制人群应限量饮用，建议搭配膳食纤维食用",
                vitamins: {
                    "维生素C": "33.6mg",
                    "叶酸": "30μg",
                    "维生素A": "7μg"
                },
                minerals: {
                    "钾": "200mg",
                    "钙": "11mg",
                    "镁": "11mg"
                }
            },
            "绿茶": {
                calories: 1,
                protein: 0.2,
                fat: 0,
                carbs: 0.2,
                fiber: 0,
                serving: "100ml",
                description: "茶叶冲泡的饮品，富含茶多酚",
                glycemicIndex: 0,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，无糖且含有抗氧化物质",
                vitamins: {
                    "维生素C": "6mg"
                },
                minerals: {
                    "钾": "27mg",
                    "锰": "0.5mg",
                    "氟": "0.4mg"
                }
            },
            "苹果汁": {
                calories: 46,
                protein: 0.1,
                fat: 0.1,
                carbs: 11.3,
                fiber: 0.2,
                serving: "100ml",
                description: "鲜榨苹果制成的果汁",
                glycemicIndex: 41,
                diabetesFriendly: false,
                healthTips: "血糖控制人群应限量饮用，建议食用新鲜水果代替果汁",
                vitamins: {
                    "维生素C": "1.2mg",
                    "维生素B6": "0.03mg"
                },
                minerals: {
                    "钾": "119mg",
                    "钙": "7mg",
                    "镁": "5mg"
                }
            },
            "咖啡": {
                calories: 1,
                protein: 0.1,
                fat: 0,
                carbs: 0,
                fiber: 0,
                serving: "100ml",
                description: "咖啡豆萃取的提神饮品，富含咖啡因和抗氧化物",
                glycemicIndex: 0,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，但不要加糖，可以少量加奶",
                vitamins: {
                    "维生素B3": "0.7mg"
                },
                minerals: {
                    "钾": "49mg",
                    "镁": "7mg",
                    "钠": "2mg"
                }
            },
            "酸奶": {
                calories: 63,
                protein: 3.5,
                fat: 3.3,
                carbs: 4.7,
                fiber: 0,
                serving: "100g",
                description: "发酵乳制品，富含益生菌和钙质",
                glycemicIndex: 35,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，建议选择无糖酸奶，富含蛋白质",
                vitamins: {
                    "维生素B2": "0.14mg",
                    "维生素B12": "0.4μg",
                    "维生素A": "27μg"
                },
                minerals: {
                    "钙": "121mg",
                    "钾": "155mg",
                    "镁": "12mg"
                }
            },
            "豆浆": {
                calories: 31,
                protein: 3.2,
                fat: 1.6,
                carbs: 2.8,
                fiber: 0.3,
                serving: "100ml",
                description: "大豆研磨制成的植物蛋白饮品",
                glycemicIndex: 30,
                diabetesFriendly: true,
                healthTips: "适合血糖控制人群，富含植物蛋白，建议选择无糖豆浆",
                vitamins: {
                    "维生素B1": "0.03mg",
                    "维生素B2": "0.02mg",
                    "维生素E": "0.4mg"
                },
                minerals: {
                    "钙": "13mg",
                    "铁": "0.4mg",
                    "锌": "0.2mg"
                }
            },
            "运动饮料": {
                calories: 26,
                protein: 0,
                fat: 0,
                carbs: 6.3,
                fiber: 0,
                serving: "100ml",
                description: "补充电解质的运动饮品",
                glycemicIndex: 78,
                diabetesFriendly: false,
                healthTips: "血糖控制人群不宜饮用，含糖量高，运动时可少量饮用",
                vitamins: {
                    "维生素B6": "0.1mg",
                    "维生素B12": "0.1μg"
                },
                minerals: {
                    "钠": "50mg",
                    "钾": "25mg",
                    "镁": "3mg"
                }
            },
            "柠檬水": {
                calories: 42,
                protein: 0.1,
                fat: 0.1,
                carbs: 10.6,
                fiber: 0.1,
                serving: "100ml",
                description: "柠檬汁调制的清爽饮品",
                glycemicIndex: 20,
                diabetesFriendly: false,
                healthTips: "血糖控制人群应选择无糖版本，富含维生素C",
                vitamins: {
                    "维生素C": "38mg",
                    "叶酸": "9μg"
                },
                minerals: {
                    "钾": "116mg",
                    "钙": "7mg",
                    "镁": "8mg"
                }
            }
        };
        
        Object.assign(foodDatabase, basicFoods);
        
        dataLoaded = true;
        hideLoading(); // 数据加载完成后隐藏加载提示
        return basicFoods;
        
    } catch (error) {
        console.error('加载食物数据失败:', error);
        dataLoaded = false;
        // 显示错误信息
        const loadingText = document.getElementById('loadingText');
        if (loadingText) {
            loadingText.textContent = '加载失败，请刷新重试';
        }
        return {};
    }
}

// 数组分块
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// 等待 DOM 加载完成后再初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 显示加载状态
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (!loadingIndicator) {
            console.error('找不到加载提示元素');
            return;
        }
        loadingIndicator.style.display = 'flex';
        
        // 加载基础数据
        await loadFoodData();
        
        // 确保所有必要的DOM元素都存在
        const screens = {
            selection: document.getElementById('selectionScreen'),
            text: document.getElementById('textSearchScreen'),
            food: document.getElementById('foodRecognitionScreen')
        };
        
        if (!screens.selection || !screens.text || !screens.food) {
            console.error('找不到必要的界面元素');
            return;
        }

        // 初始化界面状态
        screens.selection.style.display = 'block';
        screens.text.style.display = 'none';
        screens.food.style.display = 'none';
        
        // 添加动画类
        setTimeout(() => {
            screens.selection.classList.add('active');
        }, 10);
        
        // 隐藏加载状态
        setTimeout(() => {
            loadingIndicator.classList.add('hidden');
        }, 300);
    } catch (error) {
        console.error('初始化失败:', error);
        alert('加载失败，请刷新页面重试');
    }
});

// 搜索相关的DOM元素
let searchInput, searchBtn, searchResult;

// 初始化搜索界面元素
function initializeSearchElements() {
    searchInput = document.getElementById('foodSearchInput');
    searchBtn = document.getElementById('searchBtn');
    searchResult = document.getElementById('searchResult');
    
    // 添加事件监听
    searchBtn.addEventListener('click', () => {
        searchFood(searchInput.value);
    });

    searchInput.addEventListener('input', debounce((e) => {
        searchFood(e.target.value);
    }, 300));
}

// 在搜索前检查数据是否加载
function searchFood(keyword) {
    if (!dataLoaded) {
        showNoResults('数据正在加载中，请稍后再试...');
        return;
    }
    if (!searchResult) return;
    if (!keyword.trim()) {
        showNoResults('请输入食物名称');
        return;
    }
    
    const normalizedKeyword = keyword.trim().toLowerCase();
    // 使用全局变量存储别名映射
    const aliases = window.foodAliases || {};
    
    if (searchCache.has(normalizedKeyword)) {
        displayResults(searchCache.get(normalizedKeyword));
        return;
    }
    
    const results = Object.entries(foodDatabase).filter(([name]) => {
        if (name.toLowerCase().includes(normalizedKeyword)) {
            return true;
        }
        
        const foodAliases = aliases[name] || [];
        return foodAliases.some(alias => 
            alias.toLowerCase().includes(normalizedKeyword)
        );
    });

    if (results.length > 0) {
        searchCache.set(normalizedKeyword, results);
        displayResults(results);
    } else {
        showNoResults(`未找到"${keyword}"相关食物，您可以尝试：
            <ul>
                <li>检查输入是否正确</li>
                <li>尝试使用其他常见叫法</li>
                <li>使用更简单的关键词</li>
            </ul>
            <div class="search-suggestions">
                <p>常见食物：</p>
                <div class="tag-cloud">
                    <span onclick="quickSearch('米饭')">米饭</span>
                    <span onclick="quickSearch('面包')">面包</span>
                    <span onclick="quickSearch('豆腐')">豆腐</span>
                    <span onclick="quickSearch('鸡胸肉')">鸡胸肉</span>
                    <span onclick="quickSearch('西兰花')">西兰花</span>
                </div>
            </div>`
        );
    }
}

// 显示搜索结果
function displayResults(results) {
    searchResult.innerHTML = results.map(([name, data]) => `
        <div class="food-info">
            <h3>${name}</h3>
            <div class="diabetes-info ${data.diabetesFriendly ? 'friendly' : 'warning'}">
                <span class="gi-label">血糖指数(GI): ${data.glycemicIndex}</span>
                <span class="diabetes-friendly-label">
                    ${data.diabetesFriendly ? '适合' : '不适合'}血糖控制人群
                </span>
                <p class="health-tips">${data.healthTips}</p>
            </div>
            <div class="nutrition-grid">
                <div class="nutrition-item">
                    <span class="nutrition-label">热量</span>
                    <span class="nutrition-value">${data.calories}<span class="nutrition-unit">kcal</span></span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">蛋白质</span>
                    <span class="nutrition-value">${data.protein}<span class="nutrition-unit">g</span></span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">脂肪</span>
                    <span class="nutrition-value">${data.fat}<span class="nutrition-unit">g</span></span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">碳水化合物</span>
                    <span class="nutrition-value">${data.carbs}<span class="nutrition-unit">g</span></span>
                </div>
            </div>
            <div class="additional-nutrition">
                <div class="vitamins-section">
                    <h4>维生素含量</h4>
                    <div class="vitamin-grid">
                        ${Object.entries(data.vitamins).map(([name, value]) => `
                            <div class="vitamin-item">
                                <span class="vitamin-name">${name}</span>
                                <span class="vitamin-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="minerals-section">
                    <h4>矿物质含量</h4>
                    <div class="mineral-grid">
                        ${Object.entries(data.minerals).map(([name, value]) => `
                            <div class="mineral-item">
                                <span class="mineral-name">${name}</span>
                                <span class="mineral-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <p class="food-description">${data.description}</p>
            <p class="serving-size">参考份量: ${data.serving}</p>
        </div>
    `).join('');
}

// 显示无结果提示
function showNoResults(message) {
    searchResult.innerHTML = `
        <div class="error-message">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            <span>${message}</span>
            <ul>
                <li>检查输入是否正确</li>
                <li>尝试使用其他常见叫法</li>
                <li>使用更简单的关键词</li>
            </ul>
        </div>
    `;
}

// 快速搜索功能
function quickSearch(foodName) {
    searchInput.value = foodName;
    searchFood(foodName);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 界面切换函数
function showSelectionScreen() {
    // 确保所有元素存在
    const screens = {
        selection: document.getElementById('selectionScreen'),
        text: document.getElementById('textSearchScreen'),
        food: document.getElementById('foodRecognitionScreen')
    };
    
    if (!screens.selection || !screens.text || !screens.food) {
        console.error('找不到必要的界面元素');
        return;
    }

    screens.selection.style.display = 'block';
    screens.text.style.display = 'none';
    screens.food.style.display = 'none';
    
    // 添加动画类
    setTimeout(() => {
        screens.selection.classList.add('active');
        screens.text.classList.remove('active');
        screens.food.classList.remove('active');
    }, 10);
}

function showTextSearch() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('textSearchScreen').style.display = 'block';
    document.getElementById('foodRecognitionScreen').style.display = 'none';
    
    // 初始化搜索界面元素
    if (!searchInput) {
        initializeSearchElements();
    }
    
    // 添加动画类
    setTimeout(() => {
        document.getElementById('textSearchScreen').classList.add('active');
        // 显示初始数据
        quickSearch('米饭');
    }, 10);
}

function showFoodRecognition() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('textSearchScreen').style.display = 'none';
    document.getElementById('foodRecognitionScreen').style.display = 'block';
    
    // 初始化图片上传功能
    initializeImageUpload();
    
    // 添加动画类
    setTimeout(() => {
        document.getElementById('foodRecognitionScreen').classList.add('active');
    }, 10);
}

// 初始化识别功能
async function initializeRecognitionFeatures() {
    try {
        // 加载必要的脚本
        await loadScript('script.js');
        console.log('基础脚本加载完成');

        // 确保DOM元素存在
        const elements = {
            video: document.getElementById('video'),
            canvas: document.getElementById('canvas'),
            preview: document.getElementById('preview'),
            takePhoto: document.getElementById('takePhoto'),
            uploadPhoto: document.getElementById('uploadPhoto'),
            fileInput: document.getElementById('fileInput'),
            result: document.getElementById('result')
        };

        // 检查所有元素是否存在
        const missingElements = Object.entries(elements)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            throw new Error(`缺少必要的DOM元素: ${missingElements.join(', ')}`);
        }

        // 初始化事件监听器
        if (typeof initializeEventListeners === 'function') {
            console.log('初始化事件监听器...');
            initializeEventListeners();
        }

        // 初始化相机
        if (typeof initCamera === 'function') {
            console.log('初始化相机...');
            await initCamera();
        }

        // 标记为已初始化
        window.recognitionScriptsLoaded = true;

        // 隐藏加载状态
        const loadingElement = document.getElementById('recognitionLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    } catch (error) {
        console.error('初始化识别功能失败:', error);
        alert('初始化失败，请刷新页面重试');
    }
}

// 通用脚本加载函数
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        console.log(`正在加载脚本: ${src}`);
        script.onload = () => {
            console.log(`脚本加载成功: ${src}`);
            resolve();
        };
        script.onerror = (error) => {
            console.error(`脚本加载失败: ${src}`, error);
            reject(error);
        };
        document.body.appendChild(script);
    });
}

// 初始化图片上传功能
function initializeImageUpload() {
    const uploadBtn = document.getElementById('uploadPhoto');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const result = document.getElementById('result');

    if (!uploadBtn || !fileInput || !preview || !result) {
        console.error('找不到必要的上传元素');
        return;
    }

    // 上传按钮点击事件
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // 文件选择事件
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('请选择图片文件');
                return;
            }

            // 检查文件大小
            if (file.size > 4 * 1024 * 1024) {
                alert('图片大小不能超过4MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                
                // 压缩图片
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // 计算压缩后的尺寸
                    let width = img.width;
                    let height = img.height;
                    if (width > 1024) {
                        height = height * (1024 / width);
                        width = 1024;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 获取压缩后的图片数据
                    const compressedData = canvas.toDataURL('image/jpeg', 0.8);
                    analyzeImage(compressedData);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// 分析图片
async function analyzeImage(imageData) {
    const result = document.getElementById('result');
    if (!result) return;

    // 显示加载状态
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
        const offlineMode = document.getElementById('offlineMode');
        if (offlineMode) {
            offlineMode.style.display = isOnline ? 'none' : 'block';
        }

        // 调用 Clarifai API
        const response = await fetch(
            `https://api.clarifai.com/v2/models/${CONFIG.MODEL_ID}/outputs`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${CONFIG.CLARIFAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "inputs": [{
                        "data": {
                            "image": {
                                "base64": imageData.split(',')[1]
                            }
                        }
                    }]
                })
            }
        );
  
        if (!response.ok) {
            throw new Error('API 请求失败');
        }

        const resultJson = await response.json();
        
        // 处理识别结果
        const concepts = resultJson.outputs[0].data.concepts;
        // 获取前5个最可能的结果
        const topConcepts = concepts.slice(0, 5);
        
        // 在数据库中查找对应食物
        let foodInfo = null;
        let matchedName = null;
        
        // 遍历所有可能的识别结果
        for (const concept of topConcepts) {
            const englishName = concept.name.toLowerCase();
            // 检查数据库中的每个食物
            for (const [name, info] of Object.entries(foodDatabase)) {
                if (window.foodAliases[name] && 
                    window.foodAliases[name].some(alias => 
                        alias.toLowerCase().includes(englishName) ||
                        englishName.includes(alias.toLowerCase())
                    )) {
                    foodInfo = info;
                    matchedName = name;
                    break;
                }
            }
            if (foodInfo) break;
        }

        if (foodInfo) {
            displayFoodResults({
                name: matchedName,
                ...foodInfo,
                confidence: Math.round(topConcepts[0].value * 100)
            });
        } else {
            displayNonFoodMessage();
        }

    } catch (error) {
        console.error('识别失败:', error);
        result.innerHTML = `
            <div class="error-message">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                </svg>
                <span>识别失败，请检查：</span>
                <ul>
                    <li>网络连接是否正常</li>
                    <li>图片是否清晰</li>
                    <li>是否是食物图片</li>
                </ul>
                <button onclick="retryAnalyze()" class="retry-btn">重试</button>
            </div>
        `;
        result.className = 'error';
    }
}

// 显示食物识别结果
function displayFoodResults(food) {
    const result = document.getElementById('result');
    if (!result) return;

    const resultsHtml = `
        <div class="result-item high-confidence">
            <span class="food-name">${food.name}</span>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${food.confidence}%"></div>
                <span class="confidence-text">${food.confidence}%</span>
            </div>
        </div>
    `;

    result.innerHTML = `
        <div class="results-container">
            <h3>识别结果：</h3>
            <div class="food-results">
                ${resultsHtml}
            </div>
            <div class="nutrition-info">
                <h4>营养信息：</h4>
                <p>${food.name}（每${food.serving}）:</p>
                <ul>
                    <li>热量: ${food.calories}千卡</li>
                    <li>蛋白质: ${food.protein}g</li>
                    <li>碳水化合物: ${food.carbs}g</li>
                    <li>膳食纤维: ${food.fiber}g</li>
                    <li>脂肪: ${food.fat}g</li>
                </ul>
                <div class="diabetes-info ${food.diabetesFriendly ? 'friendly' : 'warning'}">
                    <span class="gi-label">血糖指数(GI): ${food.glycemicIndex}</span>
                    <span class="diabetes-friendly-label">
                        ${food.diabetesFriendly ? '适合' : '不适合'}血糖控制人群
                    </span>
                    <p class="health-tips">${food.healthTips}</p>
                </div>
            </div>
        </div>
    `;
    result.className = 'success';
}

// 显示非食物提示
function displayNonFoodMessage() {
    const result = document.getElementById('result');
    if (!result) return;

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

// 重试功能
let lastImageData = null;

function retryAnalyze() {
    if (lastImageData) {
        analyzeImage(lastImageData);
    }
}

// 限制缓存大小
setInterval(() => {
    if (searchCache.size > 100) {
        searchCache.clear();
    }
}, 300000); // 5分钟检查一次

// 初始化时设置全局别名映射
window.foodAliases = {
    "米饭": ["rice", "cooked rice", "white rice"],
    "面包": ["bread", "loaf", "toast"],
    "鸡胸肉": ["chicken breast", "chicken", "grilled chicken"],
    "豆腐": ["tofu", "bean curd"],
    "香蕉": ["banana", "bananas"],
    "苹果": ["apple", "apples"],
    "西兰花": ["broccoli"],
    "卷心菜": ["cabbage"],
    "巧克力": ["chocolate", "chocolates"],
    "薯片": ["chips", "potato chips", "crisps"],
    "果冻": ["jelly", "gelatin"],
    "坚果": ["nuts", "mixed nuts", "almonds", "walnuts"],
    "冰淇淋": ["ice cream", "icecream"],
    "蛋糕": ["cake", "pastry"],
    "奶茶": ["milk tea", "bubble tea"],
    "咖啡": ["coffee", "espresso"],
    "酸奶": ["yogurt", "yoghurt"],
    "豆浆": ["soy milk", "soymilk"],
    "柠檬水": ["lemonade", "lemon water"]
};

// 监听网络状态
window.addEventListener('online', () => {
    const offlineMode = document.getElementById('offlineMode');
    if (offlineMode) {
        offlineMode.style.display = 'none';
    }
});

window.addEventListener('offline', () => {
    const offlineMode = document.getElementById('offlineMode');
    if (offlineMode) {
        offlineMode.style.display = 'block';
    }
    alert('网络连接已断开，请检查网络设置');
}); 