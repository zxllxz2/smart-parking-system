from flask import Flask
from flask_cors import CORS
from mysql.connector import connect
from flask import request
from datetime import datetime

app = Flask(__name__)
CORS(app)

# database connection
cnx = connect(user='root', password='root', host='localhost', database='smart_parking_db')
cursor = cnx.cursor()


# response bean
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

@app.route('/user/check/', methods=['GET'])
def check_owner_servlet():
    return resp(obj=check_owner(request.args['li'], request.args['dob']))

@app.route('/user/', methods=['GET', 'POST'])
def add_new_owner():
    user = request.get_json()
    return resp(obj=register_owner(user))

@app.route('/vehicle/', methods=['GET', 'POST'])
def add_vehicle():
    vehicle = request.get_json()
    result = []
    if (len(check_vehicle(vehicle.get('plate_number'))) == 0):
        register_vehicle(vehicle)
    else:
        parking_record = check_parking(vehicle.get('plate_number'))
        if (len(parking_record) != 0):
            result = parking_record[0]
    return resp(obj=result)

@app.route('/vehicle/park/', methods=['GET', 'POST'])
def park_vehicle():
    park_info = request.get_json()
    return resp(obj=park(park_info))

@app.route('/vehicle/checkout/', methods=['GET', 'POST'])
def check_out_vehicle():
    park_info = request.get_json()
    return resp(obj=check_out(park_info))

###### Eric's servlet section

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
# 4~8, 12




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
def check_owner(license_num, dob=None):
    query = """SELECT Drivers_license_num, Lname, Minit, Fname, Date_of_birth
                FROM Owner
                WHERE Drivers_license_num='""" + str(license_num) + "'"
    
    if dob is not None:
        query += " AND Date_of_birth='" + str(dob) + "';"
    else:
        query += ";"
    
    cursor.execute(query)
    return (cursor.fetchall())

# 4 check if a specific vehicle exists in the vehicle table
def check_vehicle(plate_num):
    return []

# 5 check if a specific vehicle is parked somewhere
def check_parking(plate_num):
    return []

# 5.5 check the parking information given PID and space_no
def check_parking_vehicle(LID, space_no):
    query = "SELECT Plate, Check_in_date FROM Vehicle_Parking \
        WHERE LID='" + LID + "' AND Space_no=" + space_no + ";"
    cursor.execute(query)
    return cursor.fetchall()[0]

# 6 insert information of a user (i.e. vehicle owner) into the database
def register_owner(user):
    """ user = {
            last_name: last,
            first_name: first,
            mid_init: mid,
            date_of_birth: dob,
            license_number: license,
            phone_1: phone1,
            phone_2: phone2,
        } """
    return True

# 7 insert information of a vehicle, truck or standard car, into the database
def register_vehicle(vehicle):
    """ vehicle = {
            plate_number: plate,
            vehicle_type: vType,
            vehicle_height: height,
    } """
    return True

# 8 get the license number of the owner of the given vehicle
def get_owner(plate_num):
    return ""

# 9 park the vehicle
def park(park_info):
    id = str(park_info.get('LID'))
    num = str(park_info.get('space_number'))
    plate = str(park_info.get('plate_number'))
    
    update_query = """UPDATE Parking_space
                        SET Is_occupied=true
                        WHERE LID='""" + id + "' AND Space_no=" + num + ";"
    cur_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    insert_tuple_p = "', '".join([id, plate, cur_time])
    insert_clause = """INSERT INTO Vehicle_Parking 
                        (LID, Plate, Check_in_date, Space_no) 
                        VALUES ( '""" + insert_tuple_p + "', " + num + " );"
    success = True
    try:
        cursor.execute(update_query)
        cursor.execute(insert_clause)
    except:
        success = False
        cnx.rollback()
    else:
        cnx.commit()

    return success


# 10.1 get the hourly price of a parking space
def get_price(LID, space_no):
    query = "SELECT Hourly_price FROM Parking_space WHERE LID='" + LID + "' AND Space_no=" + space_no + ";"
    cursor.execute(query)
    return cursor.fetchall()[0][0]


# 10 check out the vehicle
def check_out(park_info):
    id = str(park_info.get('LID'))
    num = str(park_info.get('space_number'))

    plate, check_in_time = check_parking_vehicle(id, num)
    owner = get_owner(plate)
    price = get_price(id, num)

    time_delta = datetime.strptime(check_in_time, "%Y-%m-%d %H:%M:%S") - datetime.now()
    check_out_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    amount = round(((time_delta.days * 24) + round(time_delta.seconds / 3600)) * price)

    insert_tuple_p = "', '".join([owner, id, check_in_time, check_out_time])
    insert_clause = """INSERT INTO Payment 
                        (Drivers_license_num, LID, Check_in_date, Check_out_date, Amount) 
                        VALUES ( '""" + insert_tuple_p + "', " + str(amount) + " );"
    update_clause = """UPDATE Parking_space
                        SET Is_occupied=false
                        WHERE LID='""" + id + "' AND Space_no=" + num + ";"
    delete_clause = "DELETE FROM Vehicle_Parking WHERE LID='" + id + "' AND Space_no=" \
                        + num + " AND Plate='" + plate + "';"
    success = True

    try:
        cursor.execute(insert_clause)
        cursor.execute(update_clause)
        cursor.execute(delete_clause)
    except:
        success = False
        cnx.rollback()
    else:
        cnx.commit()

    return success


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
                WHERE o.Drivers_license_num LIKE '""" + str(ID) + "%';"

    cursor.execute(query)
    return cursor.fetchall()

# 12 lists all payment information of the given owner
def list_payments(license):
    return []







if __name__ == '__main__':
    app.run(debug=True)
    