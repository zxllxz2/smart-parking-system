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

@app.route('/vehicle/precheckout/', methods=['GET'])
def pre_check_out_info():
    id = str(request.args.get('LID'))
    num = str(request.args.get('spaceNo'))
    plate, check_in_time = check_parking_vehicle(id, num)
    info = {
        "plate": plate,
        "checkin": str(check_in_time),
        "license": get_owner(plate),
        "price": get_price(id, num)
    }
    return resp(obj=info)

@app.route('/vehicle/precheckout/fee/', methods=['GET'])
def get_payment():
    time = str(request.args.get('time'))
    price = float(request.args.get('price'))
    return resp(obj=settle_amount(time, price))

@app.route('/vehicle/checkout/', methods=['GET', 'POST'])
def check_out_vehicle():
    park_info = request.get_json()
    return resp(obj=check_out(park_info))


###### Eric's servlet section
# 0, 1, 2, 3, 11

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
# 4, 5, 6, 7, 8, 12




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
    query = """SELECT Plate, Type, Standard_type, Height
                    FROM Vehicle
                    WHERE Plate='""" + str(plate_num) + "';"
    cursor.execute(query)
    return cursor.fetchall()

# 5 check if a specific vehicle is parked somewhere
def check_parking(plate_num):
    query = """SELECT LID, Space_no, Plate, Check_in_date
                        FROM Vehicle_Parking
                        WHERE Plate='""" + str(plate_num) + "';"
    cursor.execute(query)
    return cursor.fetchall()

# 5.5 check the parking information given PID and space_no
def check_parking_vehicle(LID, space_no):
    query = "SELECT Plate, Check_in_date FROM Vehicle_Parking \
        WHERE LID='" + LID + "' AND Space_no=" + space_no + ";"
    cursor.execute(query)
    return cursor.fetchall()[0]

# 6 insert information of a user (i.e. vehicle owner) into the database
def register_owner(user):

    last_name = str(user.get('last_name'))
    first_name = str(user.get('first_name'))
    mid_init = user.get('mid_init')
    date_of_birth = str(user.get('date_of_birth'))
    license_number = str(user.get('license_number'))
    phone_1 = str(user.get('phone_1'))
    phone_2 = user.get('phone_2')

    if mid_init is None or mid_init == "":
        mid_init = "NULL"
    else:
        mid_init = "'" + str(mid_init) + "'"

    insert_tuple_p1 = "', '".join([license_number, last_name, first_name, date_of_birth])
    insert_clause1 = """INSERT INTO Owner 
                            (Drivers_license_num, Lname, Fname, Date_of_birth, Minit) 
                            VALUES ( '""" + insert_tuple_p1 + "', " + mid_init + " );"
    insert_clause2 = """INSERT INTO Owner_Phone 
                               (Drivers_license_num, Phone_num) 
                               VALUES ( '""" + license_number + "', " + phone_1 + " );"
    
    insert_clause3 = """INSERT INTO Owner_Phone 
                                   (Drivers_license_num, Phone_num) 
                                   VALUES ( '""" + license_number + "', " + str(phone_2) + " );"
    success = True

    try:
        cursor.execute(insert_clause1)
        cursor.execute(insert_clause2)
        if phone_2 is not None and phone_2 != "":
            cursor.execute(insert_clause3)
    except Exception as e:
        success = False
        print(e)
        cnx.rollback()
    else:
        cnx.commit()

    return success

# 7 insert information of a vehicle, truck or standard car, into the database
def register_vehicle(vehicle_info):
    """ vehicle = {
            plate_number: plate,
            vehicle_type: vType,
            vehicle_height: height,
    } """

    plate_number = str(vehicle_info.get('plate_number'))
    vehicle_type = str(vehicle_info.get('vehicle_type'))

    if vehicle_type != "Truck":
        insert_tuple_p = "', '".join([plate_number, "Standard", vehicle_type])
        insert_clause = """INSERT INTO Vehicle
                               (Plate, Type, Standard_type) 
                               VALUES ( '""" + insert_tuple_p + "' );"
    else:
        vehicle_height = str(vehicle_info.get('vehicle_height'))
        insert_tuple_p = "'" + plate_number + "', '" + vehicle_type + "', " + vehicle_height
        insert_clause = """INSERT INTO Vehicle
                                (Plate, Type, Height) 
                                VALUES ( """ + insert_tuple_p + " );"

    license = str(vehicle_info.get('license_num'))
    insert_ownership = "INSERT INTO Vehicle_Owning(Drivers_license_num, Plate) \
                        VALUES ( '" + license + "', '" + plate_number + "' );"
    success = True

    try:
        cursor.execute(insert_clause)
        cursor.execute(insert_ownership)
    except Exception as e:
        success = False
        print(e)
        cnx.rollback()
    else:
        cnx.commit()

    return success


# 8 get the license number of the owner of the given vehicle
def get_owner(plate_num):
    query = """SELECT Drivers_license_num
                            FROM Vehicle_Owning
                            WHERE Plate='""" + str(plate_num) + "';"
    cursor.execute(query)
    return cursor.fetchall()[0][0]

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
    except Exception as e:
        success = False
        print(e)
        cnx.rollback()
    else:
        cnx.commit()

    return success

# 10.1 get the hourly price of a parking space
def get_price(LID, space_no):
    query = "SELECT Hourly_price FROM Parking_space WHERE LID='" + LID + "' AND Space_no=" + space_no + ";"
    cursor.execute(query)
    return cursor.fetchall()[0][0]

# 10.2 compute the final price amount
def settle_amount(check_in_time, price):
    time_delta = datetime.now() - datetime.strptime(check_in_time, "%Y-%m-%d %H:%M:%S")
    money = round(((time_delta.days * 24) + round(time_delta.seconds / 3600)) * price)
    return max(10, money)

# 10 check out the vehicle
def check_out(park_info):
    id = str(park_info.get('lotId'))
    num = str(park_info.get('spaceNo'))
    owner = park_info.get('license')
    plate = park_info.get('plate')
    check_in_time = park_info.get('checkin')
    amount = park_info.get('finalP')
    check_out_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

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
    except Exception as e:
        success = False
        print(e)
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
    query = """SELECT Drivers_license_num, LID, Amount, Check_in_date, Check_out_date
                            FROM Payment
                            WHERE Drivers_license_num='""" + str(license) + "';"
    cursor.execute(query)
    return cursor.fetchall()




if __name__ == '__main__':
    app.run(debug=True)
    