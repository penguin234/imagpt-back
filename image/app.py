from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
import os
app = Flask(__name__)
CORS(app)

#파일 업로드
@app.route('/postimage', methods=['GET', 'POST'])
def upload_file():
	if request.method == 'POST':
		f = request.files['file']
		id = str(request.form['id'])
		#저장할 경로 + 파일명
		f.save('./uploads/' + id + '.' + f.filename.split('.')[-1])
		files = os.listdir("./uploads")    # uploads폴더에 파일 저장

		return {
			'result': 'success'
		}

	

#파일 다운로드
@app.route('/getimage/<filename>', methods = ['GET'])
def down_file(filename):
	if request.method == 'GET':
		files = os.listdir("./uploads")      # uploads폴더에 있는 파일 다운로드
		
		path = "./uploads/" 
		return send_file(path + filename,
				attachment_filename = filename,
				as_attachment=True)
	

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)