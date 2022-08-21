# Bookstore

## The project the backend of an e-commerce website for books.

### Only the sign up and the login page have a frontend, as this project is focused mainly on the backend.

### There are 5 Mongoose models:
#### 1: Author.
#### 2: User. 
#### 3: Cart.
#### 4: Order.
#### 5: Product.

### There are 3 authentication middlewares, the last two build on the first one:
#### 1: For users.
#### 2: For admins.
#### 3: For users with the same id as the one in the url or an admin.

### The main routes the project has are:
#### 1: POST /signup for adding a new user.
#### 2: POST /login for logging in.
#### 3: /shop has everything to deal with the products. It has GET for a single product/all products/search for a product. It also has a POST to add product, patch a product or delete a product if you are an admin.
#### 4: /order contains everything related for the order of the user. Admins can access it and modify it.
#### 5: /cart contains everything related for the cart of the user. Admins can also access it and modify it.
