CREATE TABLE Owner (
    Drivers_license_num varchar(20) primary key,
    Lname varchar(50) NOT NULL,
    Minit char(1),
    Fname varchar(50) NOT NULL,
    Date_of_birth varchar(10) NOT NULL
);

CREATE TABLE Owner_Phone (
    Drivers_license_num varchar(20),
    Phone_num integer,

    primary key (Drivers_license_num, Phone_num),
    foreign key (Drivers_license_num) references Owner (Drivers_license_num)
);

CREATE TABLE Parking_Lot (
    LID varchar(3) primary key,
    Address varchar(200) NOT NULL,
    Total_space integer NOT NULL
);

CREATE TABLE Payment (
    Drivers_license_num varchar(20),
    LID varchar(3),
    Amount integer NOT NULL,
    Check_in_date datetime,
    Check_out_date datetime,

    primary key (Drivers_license_num, LID),
    foreign key (Drivers_license_num) references Owner (Drivers_license_num),
    foreign key (LID) references Parking_Lot (LID)
);

CREATE TABLE Parking_Space (
    LID varchar(3),
    Space_no integer,
    Type varchar(10) NOT NULL check(Type='Standard' or Type='Truck'),
    Is_occupied boolean NOT NULL,
    Hourly_price integer NOT NULL,
    Height integer,

    primary key (LID, Space_no),
    foreign key (LID) references Parking_Lot (LID)
);


CREATE TABLE Vehicle (
    Plate varchar(10) primary key,
    Type varchar(10) check(Type='Standard' or Type='Truck'),
    Standard_type varchar(10) check(Standard_type='Compact' or Standard_type='Noncompact'),
    Height integer
);

CREATE TABLE Vehicle_Parking (
    LID varchar(3),
    Space_no integer,
	Plate varchar(10),
    Check_in_date datetime,

    primary key (LID, Plate, Space_no),
    foreign key (LID) references Parking_Lot (LID),
    foreign key (Plate) references Vehicle (Plate)
);

CREATE TABLE Vehicle_Owning (
    Drivers_license_num varchar(20),
    Plate varchar(10),

    primary key (Drivers_license_num, Plate),
    foreign key (Drivers_license_num) references Owner (Drivers_license_num),
    foreign key (Plate) references Vehicle (Plate)
);



INSERT INTO Parking_Lot (LID, Address, Total_space)
VALUES
    ('73', '2858–2932 Dudely Pl, Nashville, TN', 8),
    ('25', '2400 Blakemore Ave, Nashville, TN', 12),
    ('77', '1200 18th Ave S, Nashville, United States', 6);

INSERT INTO Owner (Drivers_license_num, Lname, Minit, Fname, Date_of_birth)
VALUES
    ('123456789', 'Peter' , 'A', 'Parker', '1990-02-23'),
    ('987654321', 'Alter' , 'B', 'Susan', '1999-03-14'),
    ('111111111', 'Goodman' , 'C', 'Lily', '1956-12-23'),
    ('222222222', 'Wilson' , 'D', 'James', '2001-09-13'),
    ('555555555', 'Lee' , 'E', 'Peter', '1981-10-23'),
    ('333333333', 'Lee' , 'A', 'Peter', '1990-02-23'),
    ('A12345678', 'Doe' , 'B', 'John', '1999-03-14'),
    ('999999999', 'King' , 'C', 'Amber', '1956-12-23');

INSERT INTO Owner_Phone
VALUES
    ('123456789', 917416476),
	('123456789', 917416488);


INSERT INTO Vehicle
VALUES
    ('ABCDEF', 'Standard', 'Compact', NULL),
    ('FEDCBA', 'Standard', 'Noncompact', NULL),
    ('AAAAAA', 'Standard', 'Compact', NULL),
    ('BBBBBB', 'Standard', 'Noncompact', NULL),
    ('CCCCCC', 'Standard', 'Noncompact', NULL),
    ('DDDDDD', 'Truck', NULL, NULL),
    ('FFFFFF', 'Standard', 'Compact', NULL),
    ('GGGGGG', 'Standard', 'Compact', NULL);

INSERT INTO Vehicle_Owning
VALUES
    ('123456789', 'ABCDEF'),
    ('987654321', 'FEDCBA'),
    ('111111111', 'AAAAAA'),
    ('222222222', 'BBBBBB'),
    ('555555555', 'CCCCCC'),
    ('333333333', 'DDDDDD'),
    ('A12345678', 'FFFFFF'),
    ('999999999', 'GGGGGG');

INSERT INTO Parking_Space
VALUES
    ('73', 0001, 'Standard', true, 0.5, NULL),
    ('73', 0002, 'Standard', false, 0.5, NULL),
    ('73', 0003, 'Standard', false, 0.5, NULL),
    ('73', 0004, 'Standard', false, 0.5, NULL),
    ('73', 0005, 'Truck', false, 1.2, 3),
    ('73', 0006, 'Truck', false, 1.2, 3),
    ('73', 0007, 'Truck', false, 1.2, 3),
    ('73', 0008, 'Truck', false, 1.2, 3),

    ('25', 0001, 'Standard', false, 0.7, NULL),
    ('25', 0002, 'Standard', false, 0.7, NULL),
    ('25', 0003, 'Standard', false, 0.7, NULL),
    ('25', 0004, 'Standard', false, 0.7, NULL),
    ('25', 0005, 'Standard', false, 0.7, NULL),
    ('25', 0006, 'Standard', false, 0.7, NULL),
    ('25', 0007, 'Standard', false, 0.7, NULL),
    ('25', 0008, 'Truck', false, 3, NULL),
    ('25', 0009, 'Truck', false, 3, NULL),
    ('25', 0010, 'Truck', false, 3, NULL),
    ('25', 0011, 'Truck', false, 3, NULL),
    ('25', 0012, 'Truck', false, 3, NULL),


    ('77', 0003, 'Standard', false, 2, NULL),
    ('77', 0004, 'Standard', false, 2, NULL),
    ('77', 0005, 'Standard', false, 2, NULL),
    ('77', 0006, 'Standard', false, 2, NULL),
    ('77', 0001, 'Truck', false, 1, 4),
    ('77', 0002, 'Truck', false, 1, 4);

INSERT INTO Vehicle_Parking
VALUES
	('73',  0001, 'ABCDEF', '2022-11-16 19:32:04');

SELECT Space_no, Type, Is_occupied FROM Parking_Space WHERE LID=25;

SELECT Lname, Minit, Fname, Phone_num, v.Plate, Type, LID, Space_no, Check_in_date
FROM Owner o 
LEFT JOIN Owner_Phone p 
ON o.Drivers_license_num  = p.Drivers_license_num
LEFT JOIN Vehicle_owning vo
ON o.Drivers_license_num=vo.Drivers_license_num
LEFT JOIN Vehicle v
ON vo.Plate=v.Plate
LEFT JOIN Vehicle_Parking vp
ON vo.Plate=vp.Plate
WHERE o.Drivers_license_num='123456789'
    
