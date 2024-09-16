# Inventory and Order Management System API Documentation

## Project Introduction
This project is designed to manage an order and inventory system with integration to external services for payment processing and inventory synchronization. The project is built using Node.js and Sequelize for database interaction, and it ensures consistency between the internal inventory database and an external warehouse system.

### The system features:

**Inventory Management**: Tracks product inventory levels and ensures stock consistency with an external warehouse system through scheduled synchronization.
**Order Management**: Handles orders placed by users, processing payments and updating inventory accordingly.
**Error Monitoring & Logging**: Uses Sentry and Morgan to monitor errors and log HTTP requests.
**Async Job Scheduling**: Regularly syncs inventory levels with external systems to ensure consistency.
**Database Migrations**: Handles schema changes using Sequelize migrations.
**Performance Monitor**: Uses Express Status Monitor to monitor performance of Node.

### Key Features:
**Inventory Syncing**: The system periodically syncs inventory with the external warehouse API to keep internal stock levels consistent with the actual warehouse.
**Graceful Error Handling**: Payment failures and inventory mismatches trigger retries and rollbacks to maintain data integrity.
**Database Migrations**: SQL migrations are used to modify the database schema without downtime, allowing for safe feature additions like categorizing products.

## Tech Stack:
    Node Js, Typescript, PostgreSQL, Sequelize

## Project Setup
1. **Install Dependencies**:
   Run the following command to install necessary dependencies:
   ```bash
   npm install
    ```
2. **Environment Variables**: Create a `.env` file at the root of the project with the following:
   ```
    BACKEND_PORT=3000
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASS=yourpassword
    DB_NAME=lorcan-bet-async
    DB_PORT=5432
    SENTRY_DSN_URL=your-sentry-dsn 
    WAREHOUSE_API_URL=''
    CRON_SCHEDULE="0 * * * *"
   ```
3. **Start the Server**: Run the app:   
    ```
    npm start
    ```
## Other commands

1. **Performance Monitor** : To see the backend performance open:
    ```
    http://localhost:3000/status
    ```
2. **Create Migration** : It already exists. If you want to generate your own migration then:
    ```
   npm run migration:generate create-categories
    ```
3. **Database Migration** : Once migration file exists, then database can be migrated using:
    ```
   npm run migrate
    ```

## API Documentation

### Products

#### Get All Products
- **Endpoint:** `GET /product`
- **Description:** Fetch all products.



#### Create Product

-   **Endpoint:** `POST /product`
-   **Description:** Create a new product.
- **Request Body:** `{
  "name": "Sample Product",
  "price": 19.99,
  "description": "A sample product description"
}`




#### Update Product

-   **Endpoint:** `PUT /product/:id`
-   **Description:** Update a product by ID.
-  **Request Body :** `{
  "name": "Updated Product",
  "price": 24.99,
  "description": "An updated product description"
}`

#### Delete Product

-   **Endpoint:** `DELETE /product/:id`
-   **Description:** Delete a product by ID.

* * * * *

### Orders

#### Create Order

-   **Endpoint:** `POST /order`
-   **Description:** Create a new order.
- **Request Body:** `{
  "productId": 1,
  "quantity": 2
}`

#### Get Order by ID

-   **Endpoint:** `GET /order/:id`
-   **Description:** Fetch an order by ID.


#### Get All Orders

-   **Endpoint:** `GET /order`
-   **Description:** Fetch all orders.

* * * * *
### Inventory

#### Get All Inventory Items
- **Endpoint:** `GET /inventory`
- **Description:** Fetch all inventory items.


#### Create Inventory Item

-   **Endpoint:** `POST /inventory`
-   **Description:** Create a new inventory item.
- **Request Body:** `{
  "productId": 1,
  "quantity": 100
}`

#### Delete Inventory Item

-   **Endpoint:** `DELETE /inventory/:id`
-   **Description:** Delete an inventory item by ID.


#### Update Inventory Item

-   **Endpoint:** `PUT /inventory/:id`
-   **Description:** Update an inventory item by ID.
- **Request Body:** `{
  "productId":1, 
  "quantity": 75
}`

******

Please reachout to me if you find any difficulties. Thank you.


    
