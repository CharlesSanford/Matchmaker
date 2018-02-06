import axios from 'axios'

const URLSearchParams = require('url-search-params')
// https://github.com/WebReflection/url-search-params

// APISrv main APISrv, shared across the file because dry
const APISrv = axios.create({
    baseURL: window.siteConfig.apiBaseUrl,  // Set in config.json, configured by NODE_ENV, bathed in the blood of our enimies
    timeout: 0, // Never gonna let you go
    xDomain: true // Because it's another domain, X == across
})

// Start Service with axios
const CARTSrv = axios.create({
    baseURL: window.NCCATBASE,
    timeout: 3000
})

export default {  // Seems plain, but does the job
    /**
     * getCart      gets the cart from an internal api on Bigcommerce
     *              if the count is messed up, start here
     * @uses axios
     * @param  {Function} cb Function that is called after trying to get the
     *                       cart
     * @return {Mixed}      Returns an integer if it's successful, false if
     *                      stuff broked
     */
    getCart(cb) {
        // Cart const duh
        const Cart = axios.create({
            baseURL: '/internalapi/v1/checkout', // Internal API straight from the horse's mouth, Big Commerce is the horse
            timeout: 0, // Never gonna let you go Jack
            xDomain: true // Because it's another domain, X == across
        })
        // Alright, lets try and get this so called "quote"
        Cart.get('/quote?includes=cart').then( (response) => {
            // Sweet it worked!
            let cart = false
            if(response.status === 200) {
                cart = response.data.data
            }
            // Send that Cart dawg
            cb(cart)
        }).catch( (e) => {
            // errors broked things, better send the false.
            cb(false)
        })
    },
    /**
     * addToCart Adds a product to Bigcommerce Cart
     * @param {Object}      product Product obj passed from mutation
     * @param {Function}    cb      Function that is called after trying
     *                              to add product to the cart
     */
    addToCart(product, cb) {
        // There is a pollyfill in place for URLSearchParams()
        // It'd be nice if was supported everywhere, but whatever
        let params = new URLSearchParams()
        params.append('action', 'add') // We're adding items to the cart
        params.append('fastcart', 1) // Super Fast jellyfish
        params.append('ajaxsubmit', 0) // This what they call an idiom
        params.append('product_id', product.id) // product id from the obj
        // Looping through attributes from product obj
        product.attributes.forEach( (a) => {
            // We need to add each of the attributes to the url
            // In most cases this where you'll see "Select a valid ..."
            // or "Select something ..." Error inside Bigcommerce.
            // In that instance, something is up with either the Option or
            // Modifiers that are stored inside the API and configured
            // through the Bigcommerce Admin
            params.append('attribute['+a.key+']', a.value)
        })
        params.append('qty', product.qty) // How many of this item do we want?
        // Alright, here we go. Let's add this bad boy to the cart.
        CARTSrv.get('/cart.php?' + params.toString()).then((response) => {
            // It worked!
            cb(true)
        }).catch( (e) => {
            // All and any errors return false
            // Because it didn't
            // So it's not true
            cb(false)
        })
    },
    removeCartItem(itemId, cb) {
        let params = new URLSearchParams()
        params.append('action', 'remove') // We're adding items to the cart
        params.append('fastcart', 1) // Super Fast jellyfish
        params.append('ajaxsubmit', 0) // This what they call an idiom
        params.append('item', itemId)

        CARTSrv.get('/cart.php?' + params.toString()).then((response) => {
            // It worked!
            cb(true)
        }).catch( (e) => {
            // All and any errors return false
            // Because it didn't
            // So it's not true
            cb(false)
        })
    },
    /**
     * getProductsAPI Get's products from the API
     * @see http://confluence.redventures.net/display/NC/Products+Endpoint
     * @param  {Function} cb Function that is called after trying to get
     *                       products from API Endpoint
     * @return {Mixed}       Returns with cb either false is things broke,
     *                       Or and Object containing products
     */
    getProductsAPI(cb) {
        // Let's get all the tings
        APISrv.get('/products?l=2&is_visible=1&include=categories,options,modifiers,variants,images,custom_fields,videos').then( (response) => {
            // We got something, send it back Jack
            cb(response.data.result)
        }).catch( (e) => {
            // There is likely an issue with the API if we're unable to
            // get products.
            cb(false)
        })
    },
    /**
     * getReviews Get's product reviews
     * @see http://confluence.redventures.net/display/NC/Products+Endpoint#ProductsEndpoint-/products/{productID}/reviews
     *
     * @param  {Object}   product The product we want reviews for
     * @param  {Function} cb      Function that is called after trying to get
     *                            products reviews from API Endpoint
     * @return {Mixed}            Object of reviews, or false depends on what
     *                            happens
     */
    getReviews(product, cb) {
        // Get em'
        APISrv.get(`/products/${product.id}/reviews`).then( (response) => {
            cb(response.data.result) // Send em'
        }).catch( (e) => {
            cb(false) // Broke em'
            // If we're sending false there is something seriously wrong,
            // You should have your doctor take a look
        })
    },
    /**
     * addReview One doesn't simply add a review without an endpoint
     * @see http://confluence.redventures.net/display/NC/Products+Endpoint#ProductsEndpoint-/products/{productID}/add-review(POST)
     * @param {Integer}   id     Product ID for the review
     * @param {Object}    review Object for the review
     * @param {Function} cb     [description]
     */
    addReview(id, review, cb) {
        APISrv.post(`/products/${id}/add-review`, review).then( (response) => {
            cb(response.data.result)
        })
    },
    /**
     * [subscribe description]
     * @param  {[type]}   email [description]
     * @param  {Function} cb    [description]
     * @return {[type]}         [description]
     */
    subscribe(email, cb) {
        const payload = {
            email: email,
            source: "custom"
        }
        APISrv.post(`/subscribe`, payload).then( (response) => {
            cb(response.data)
        })
    },
    /**
     * [getCategories description]
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    getCategories(cb) {
        let sortedCategories = []

        APISrv.get('/categories/?is_visible=1').then(
            (response) => {
                const categories = response.data.result
                let parents = categories.filter( (c) => {
                    return (c.parent_id === 0)
                })
                const featuredIngredients = categories.filter( (c) => {
                    return c.name.toLowerCase()=== "featured ingredients"
                })
                if( featuredIngredients.length > 0 ) {
                    featuredIngredients[0].name = "Ingredients"
                    parents.push(featuredIngredients[0])
                }

                parents.forEach( (p) => {
                    const id = p.id

                    const name = (p.name === "Products") ? "Supplement Type" : p.name

                    const order = (p.name === "Products") ? 1 : 0

                    const children = categories.filter( (c) => {
                        return c.parent_id === p.id
                    })

                    sortedCategories.push({
                        name: name,
                        id: id,
                        filter: name.toLowerCase().replace(" ", "_"),
                        order: order,
                        items: children
                    })
                })

                cb(sortedCategories.sort( (a,b) => {
                        return b.order - a.order
                }))
        })
    }
}
