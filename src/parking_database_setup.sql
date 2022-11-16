CREATE TABLE Owner (
    Drivers_license_num varchar(20) primary key,
    Lname varchar(50) NOT NULL,
    Minit char(1),
    Fname varchar(50) NOT NULL,
    Date_of_birth date NOT NULL
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
    Check_in_date date,
    Check_in_time time,
    Check_out_date date,
    Check_out_time time,

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
    Type varchar(10) check(Type='Compact' or Type='Noncompact'),
    Height integer
);

CREATE TABLE Vehicle_Parking (
    LID varchar(3),
    Plate varchar(10),
    Space_no integer,
    Check_in_date date,
    Check_in_time time,

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
    ('123456789', 'Parker' , 'A', 'Peter', '1990-02-23'),
    ('987654321', 'Susan' , 'B', 'Alter', '1999-03-14'),
    ('111111111', 'Lily' , 'C', 'Goodman', '1956-12-23'),
    ('222222222', 'James' , 'D', 'Wilson', '2001-09-13'),
    ('555555555', 'Peter' , 'E', 'Lee', '1981-10-23'),
    ('333333333', 'Peter' , 'A', 'Lee', '1990-02-23'),
    ('A12345678', 'John' , 'B', 'Doe', '1999-03-14'),
    ('999999999', 'Amber' , 'C', 'King', '1956-12-23');

INSERT INTO Owner_Phone
VALUES
    ('123456789', 917416476);


INSERT INTO Vehicle
VALUES
    ('ABCDEF', 'Compact', NULL),
    ('FEDCBA', 'Noncompact', NULL),
    ('AAAAAA', 'Compact', NULL),
    ('BBBBBB', 'Noncompact', NULL),
    ('CCCCCC', 'Noncompact', NULL),
    ('DDDDDD', NULL, NULL),
    ('FFFFFF', 'Compact', NULL),
    ('GGGGGG', 'Compact', NULL);

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
    ('73', 0001, 'Standard', false, 0.5, NULL),
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
    ('77', 0006, 'Standard', false, 2, NULL);
    ('77', 0001, 'Truck', false, 1, 4),
    ('77', 0002, 'Truck', false, 1, 4);





    
