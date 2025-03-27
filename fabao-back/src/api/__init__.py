from flask import Blueprint

api = Blueprint('api', __name__)

# 导入路由
from . import routes