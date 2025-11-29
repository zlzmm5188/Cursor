FROM nginx:alpine

# 复制所有文件
COPY . /usr/share/nginx/html/

# 创建健康检查文件
RUN echo 'OK' > /usr/share/nginx/html/health.txt

# 复制配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
