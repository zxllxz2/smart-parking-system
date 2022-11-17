from flask import Flask
from flask_cors import CORS
from mysql.connector import connect
from flask import request

app = Flask(__name__)
CORS(app)

# database connection
cnx = connect(user='root', password='root', host='localhost', database='smart_parking_db')
cursor = cnx.cursor()


def resp(code=200, msg="", obj=None):
    return {
        "code": code,
        "message": msg,
        "object": obj
    }
        

###### Toby's servlet section

@app.route('/lot/all/', methods=['GET'])
def get_all_lots_servlet():
    return resp(obj=get_all_lots())
# 10, 11


###### Eric's servlet section
# 1~7

@app.route('/lot/listSpace/', methods=['GET'])
def list_space_servlet():
    return resp(obj=list_space(request.args.get('LID')))

@app.route('/lot/computeIdle/', methods=['GET'])
def compute_idle_servlet():
    return resp(obj=compute_idle(request.args.get('LID')))

@app.route('/user/listOwner/', methods=['GET'])
def list_owner_servlet():
    return resp(obj=list_owner(request.args.get('ID')))

###### Gloria's servlet section
# sql files for creation and insertion
# 8,9,12,13



###### backend queries


# 0 get all parking lot ids
def get_all_lots():
    query = "SELECT LID FROM Parking_Lot"
    cursor.execute(query)
    return cursor.fetchall()

# 1 get all parking spaces from a parking lot
def list_space(LID):
    query = "SELECT Space_no, Type, Is_occupied FROM Parking_Space WHERE LID=" + str(LID)
    cursor.execute(query)
    return cursor.fetchall()

# 2 get the number of idle parking spaces in a parking lot 
def compute_idle(LID):
    query = "SELECT COUNT(Space_no) FROM Parking_Space WHERE Is_occupied=false AND LID='" + str(LID) + "';"
    cursor.execute(query)
    return cursor.fetchall()

# 3 check if owner exists given the license_number
def check_owner(license_num):
    query = """SELECT *
                FROM Owner
                WHERE Drivers_license_num='""" + str(license_num) + "';"
    
    cursor.execute(query)
    return (cursor.fetchall())

# 4 

# 5

# 6

# 7

# 8

# 9

# 10

# 11 given the drivers license id, provide all information about the owner
def list_owner(ID):
    query = """SELECT Fname, Minit, Lname, Date_of_birth, Phone_num, v.Plate, Type, LID, Space_no, Check_in_date
                FROM Owner o 
                LEFT JOIN Owner_Phone p 
                ON o.Drivers_license_num  = p.Drivers_license_num
                LEFT JOIN Vehicle_owning vo
                ON o.Drivers_license_num=vo.Drivers_license_num
                LEFT JOIN Vehicle v
                ON vo.Plate=v.Plate
                LEFT JOIN Vehicle_Parking vp
                ON vo.Plate=vp.Plate
                WHERE o.Drivers_license_num='""" + str(ID) + "';"

    cursor.execute(query)
    return cursor.fetchall()

# 12







if __name__ == '__main__':
    app.run(debug=True)
    