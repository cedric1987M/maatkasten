CREATE TABLE `configurations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`depth` int NOT NULL,
	`numberOfCompartments` int NOT NULL DEFAULT 1,
	`numberOfShelves` int NOT NULL DEFAULT 2,
	`numberOfDoors` int NOT NULL DEFAULT 1,
	`numberOfDrawers` int NOT NULL DEFAULT 0,
	`hasClothingRail` int NOT NULL DEFAULT 0,
	`material` varchar(100) NOT NULL DEFAULT 'white_melamine',
	`totalPrice` decimal(10,2) NOT NULL,
	`configData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `configurations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`configurationId` int NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`status` enum('pending','confirmed','in_production','completed','cancelled') NOT NULL DEFAULT 'pending',
	`totalPrice` decimal(10,2) NOT NULL,
	`notes` text,
	`configSnapshot` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricingRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`whiteMelaminePrice` decimal(10,2) NOT NULL DEFAULT '25.00',
	`oakDecorPrice` decimal(10,2) NOT NULL DEFAULT '35.00',
	`blackDecorPrice` decimal(10,2) NOT NULL DEFAULT '30.00',
	`pricePerShelf` decimal(10,2) NOT NULL DEFAULT '5.00',
	`pricePerDrawer` decimal(10,2) NOT NULL DEFAULT '15.00',
	`pricePerDoor` decimal(10,2) NOT NULL DEFAULT '20.00',
	`clothingRailPrice` decimal(10,2) NOT NULL DEFAULT '10.00',
	`hardwarePrice` decimal(10,2) NOT NULL DEFAULT '15.00',
	`installationPrice` decimal(10,2) NOT NULL DEFAULT '50.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricingRules_id` PRIMARY KEY(`id`)
);
