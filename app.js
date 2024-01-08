// 空的 API 密钥 - 应替换为您的 API 密钥
const API_KEY = '';

// 从 HTML DOM 获取元素
const submitButton = document.querySelector('#submit');
const outputElement = document.querySelector('#output');
const inputElement = document.querySelector('#user-input');
const historyElement = document.querySelector('.history');
const newChatButton = document.querySelector('#new-chat');

// 使用 OpenAI API 获取 ChatGPT 响应的异步函数
async function fetchChatGPTResponse(message) {
    // 发送 HTTP POST 请求到 OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,  // 设置 API 认证头
            'Content-Type': 'application/json'     // 设置内容类型为 JSON
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",               // 指定使用的模型
            messages: [{ role: "user", content: message }],  // 用户消息
            max_tokens: 100                       // 设置最大令牌数量，输入的量
        })
    });

    // 检查响应状态
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();  // 解析并返回 JSON 响应
}

// 将消息附加到聊天历史记录的函数
function appendMessageToHistory(role, message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = role + ": " + message; // 设置文本内容
    messageElement.className = role === 'user' ? 'user-message' : 'bot-message'; // 根据角色设置样式类
    historyElement.appendChild(messageElement); // 将元素添加到历史记录中
}

// 处理消息提交的异步函数
async function handleMessageSubmission() {
    const userMessage = inputElement.value.trim(); // 获取并清理输入框的内容
    if (!userMessage) return; // 如果消息为空，则不执行任何操作

    appendMessageToHistory('user', userMessage); // 将用户消息添加到历史记录
    inputElement.value = ''; // 清空输入框

    try {
        const data = await fetchChatGPTResponse(userMessage); // 获取 ChatGPT 响应
        const botMessage = data.choices[0].message.content;   // 获取响应内容
        outputElement.textContent = botMessage;              // 显示响应内容
        appendMessageToHistory('bot', botMessage);            // 将响应添加到历史记录
    } catch (error) {
        console.error(error); // 打印错误到控制台
        outputElement.textContent = 'Error: ' + error.message; // 显示错误信息
    }
}

// 为提交按钮和输入框添加事件监听器
submitButton.addEventListener('click', handleMessageSubmission);
inputElement.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {  // 如果按下 Enter 键
        handleMessageSubmission(); // 提交消息
    }
});

// 为新聊天按钮添加点击事件监听器，用于清空聊天
newChatButton.addEventListener('click', () => {
    inputElement.value = '';          // 清空输入框
    outputElement.textContent = '';   // 清空输出元素
    historyElement.innerHTML = '';    // 清空历史记录
});
