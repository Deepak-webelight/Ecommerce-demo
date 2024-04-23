# E-commerce Platform:

# Description:
 Create a simple e-commerce platform where users can register, log in, view products, add them to their cart, and make purchases. Focus on the relationship between users and products.

# Key Features:
- User authentication (signup, login, logout). :  // { id: userId }
    - authentication
        - /sign-up
        - /login
        - /logout
        - /refresh
    - /:id                          : get method
    - /:id                          : patch method for update user details 
    - /:id                          : delete method for delete user details

- Product listing with details (name, description, price). : { id: productId }
    - /                             :   // add products data, as of now add local data  : post method 
    - /:id                          :   // update product data by id                    : patch method for update
    - /:id                          :   // delete product data by id                    : delete method for delete product
    - /getProduct/:id               :   // search product by id 
    - /filter?                      :   // filter product by query and param
    - /getAllProducts               :   // get all products data

- Cart functionality (add/remove items). : { id : cartId }
    - /addToCart/:id                :   // add product to cart
    - /removeFromCart/:id           :   // remove product from cart
    - /updateCartCount/:id          :   // Increment or decrement product count
    
- Checkout process.
    - /checkout/:id                 :   // check out products in cart
    - /payment/:id                  :   // payment for the product
    - /cancelOrder/:id              :   // cancel order 

- User-specific order history.
    - /OrderHistory/:id             :   // get order history
    - /OrderDetails/:id             :   // get order details by ID