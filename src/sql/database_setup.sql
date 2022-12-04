CREATE TABLE Owner (
    Drivers_license_num varchar(20) primary key,
    Lname varchar(50) NOT NULL,
    Minit char(1),
    Fname varchar(50) NOT NULL,
    Date_of_birth varchar(10) NOT NULL
);

CREATE TABLE Owner_Phone (
    Drivers_license_num varchar(20),
    Phone_num bigint,

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

    primary key (Drivers_license_num, LID, Check_in_date),
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
    Type varchar(10) NOT NULL check(Type='Standard' or Type='Truck'),
    Standard_type varchar(10) check(Standard_type='Compact' or Standard_type='Noncompact'),
    Height integer
);

CREATE TABLE Vehicle_Parking (
    LID varchar(3),
    Space_no integer,
	Plate varchar(10),
    Check_in_date datetime,

    primary key (LID, Plate, Space_no),
    foreign key (LID, Space_no) references Parking_Space (LID, Space_no),
    foreign key (Plate) references Vehicle (Plate)
);

CREATE TABLE Vehicle_Owning (
    Drivers_license_num varchar(20),
    Plate varchar(10),

    primary key (Drivers_license_num, Plate),
    foreign key (Drivers_license_num) references Owner (Drivers_license_num),
    foreign key (Plate) references Vehicle (Plate)
);
