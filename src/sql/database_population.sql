INSERT INTO Parking_Lot (LID, Address, Total_space)
VALUES
    ('73', '2858-2932 Dudely Pl, Nashville, TN', 8),
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
    ('DDDDDD', 'Truck', NULL, 2),
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
    ('73', 0001, 'Standard', false, 0.5, NULL),
    ('73', 0002, 'Standard', false, 0.5, NULL),
    ('73', 0003, 'Standard', false, 0.5, NULL),
    ('73', 0004, 'Standard', true, 0.5, NULL),
    ('73', 0005, 'Truck', false, 1.2, 3),
    ('73', 0006, 'Truck', false, 1.2, 3),
    ('73', 0007, 'Truck', false, 1.2, 3),
    ('73', 0008, 'Truck', false, 1.2, 3),

    ('25', 0001, 'Standard', true, 0.7, NULL),
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
    ('77', 0004, 'Standard', true, 2, NULL),
    ('77', 0005, 'Standard', false, 2, NULL),
    ('77', 0006, 'Standard', false, 2, NULL),
    ('77', 0001, 'Truck', false, 1, 4),
    ('77', 0002, 'Truck', true, 1, 4);

INSERT INTO Vehicle_Parking
VALUES
    ('25', 1, 'CCCCCC', '2022-11-19 00:46:29'),
    ('73', 4, 'FFFFFF', '2022-11-19 00:23:32'),
    ('77', 4, 'ABCDEF', '2022-11-19 18:20:09'),
    ('77', 2, 'DDDDDD', '2022-11-19 01:25:16');

INSERT INTO Payment (Drivers_license_num, LID, Amount, Check_in_date, Check_out_date)
VALUES
    ('123456789', '73', 70, '2022-11-16 19:32:04', '2022-11-19 17:51:26'),
    ('123456789', '77', 10, '2022-11-19 18:16:38', '2022-11-19 18:16:59');
