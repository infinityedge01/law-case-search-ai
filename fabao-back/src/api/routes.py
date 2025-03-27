from flask import jsonify, request
from . import api
from flask_cors import cross_origin
from functions.autosearch import auto_search
from utils.generate_response import generate_response, generate_error_response

@api.route('/search/auto', methods=['POST'])
@cross_origin()
def autosearch():
    """搜索接口
    接收JSON格式的POST请求，返回JSON格式的响应
    """
    # 获取请求数据
    data = request.get_json()
    
    # 打印接收到的数据（用于调试）
    print("Received search request:", data)
    data = data.get('text', '')
    # 检查数据是否为空
    if not data:
        return generate_error_response(message="请求数据不能为空", status=400)
    # 调用自动检索函数
    results = auto_search(data)
    response = generate_response(data=results, status=200)
    return response