import {
  INTCREMENT_ITEM,
  DECREASE_ITEM,
  ONCHANGE_HANDLER,
  TAKES_TO_CART,
  RETURNS_TO_CART,
  PAYMENT_STACK,
  PAYMENT_BANK,
  PAYMENT_CHECK,
  CHANGEPAYMENT_TYPES,
  SHIPPING_INFO,
  UPDATE_SHIPPING_INFO
} from "./Types";
import Swal from "sweetalert2";
import axios from "axios";
import {apiUrl} from './../../Script/config'



// INTCREMENT_ITEM BUTTON IN MY PRODUCT_SINGLE
export const incrementItem = value => {
  let newValue = parseInt(value) + 1;
  return dispatch => {
    dispatch({
      type: INTCREMENT_ITEM,
      payload: newValue
    });
  };
};



// DECREASE_ITEM BUTTON IN MY PRODUCT_SINGLE_PAGE
export const decreaseItem = value => {
  return dispatch => {
    let newValue = parseInt(value) - 1;
    if (newValue === 0) {
      return;
    }
    dispatch({
      type: DECREASE_ITEM,
      payload: newValue
    });
  };
};

// SET ATTRIBUTE BUTTON IN MY PRODUCT_SINGLE_PAGE
export const setAttribut = value => {
  return dispatch => {
    let newValue = parseInt(value) - 1;
    if (newValue === 0) {
      return;
    }
    dispatch({
      type: DECREASE_ITEM,
      payload: newValue
    });
  };
};

// IT WORKS FOR MY INPUT VALUE SEARCH BOX IN MY PRODUCT_SINGLE_PAGE
export const handler = e => {
  let newValue = e.target.value;
  return dispatch => {
    dispatch({
      type: ONCHANGE_HANDLER,
      payload: newValue
    });
  };
};



//THIS IS MY ADD_TO_CART / TAKES_TO_CART / RETURNS_TO_CART AND ALSO I MAKE USE OF SWEETALERT2
export const addedtocart = (data, atttributes, quantity) => {
  return dispatch => {
    let cartId = JSON.parse(localStorage.getItem('cartId'))
    // let atttributes = {
    //   "attribute_value_id": 2,
    //   "attribute_name": "Size",
    //   "attribute_value": "M"
    // }
    if (cartId !== null) {
      
      let bodyFormData = new FormData();
      bodyFormData.set("cart_id", cartId);
      bodyFormData.set("product_id", data.product_id);
      bodyFormData.set("attributes", JSON.stringify(atttributes));
      
        
        axios.post(apiUrl+'shoppingcart/add', bodyFormData)
        .then(res =>{
          if (quantity === 1){
            Swal.fire({
              title: "Added to Cart",
              text: "Item is added to you Cart",
              icon: "success",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "GO TO CART",
              cancelButtonText: "COUTINUE SHOPPING"
            }).then(result => {
              if (result.value) {
                dispatch({
                  type: TAKES_TO_CART,
                  payload: true
                });
                dispatch({
                  type: RETURNS_TO_CART,
                  payload: false
                });
              }
            });
          }
          else{
            dispatch(addedtocart(data, atttributes, quantity-1))
          }
          
        })
        .catch(err =>{
          console.log(err)
        })
      
      
   
    } else {
      let bodyFormData = new FormData();
      bodyFormData.set("product_id", data.product_id);
      bodyFormData.set("attributes", atttributes);

      axios.get(apiUrl+'shoppingcart/generateUniqueId')
      .then(res =>{
          localStorage.setItem('cartId', JSON.stringify(res.data.cart_id));
          bodyFormData.set("cart_id", res.data.cart_id);
          axios.post(apiUrl+'shoppingcart/add', bodyFormData)
          .then(res =>{
            console.log(res, ' i am addding to rrr', res.data.cart_id)
            Swal.fire({
              title: "Added to Cart",
              text: "Item is added to you Cart",
              icon: "success",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "GO TO CART",
              cancelButtonText: "COUTINUE SHOPPING"
            }).then(result => {
              if (result.value) {
                dispatch({
                  type: TAKES_TO_CART,
                  payload: true
                });
                dispatch({
                  type: RETURNS_TO_CART,
                  payload: false
                });
              }
            });
          })
          .catch(err =>{
            console.log(err)
          })

      })
      .catch(err=>{
        console.log(err, 'i am err')
      })
      
    }
   
  };
};

// PAYMENT FOR MY PAYSTACK PLATFORM
export const clickedPayStack = () => {
  return dispatch => {
    let handler = window.PaystackPop.setup({
      // My public key from paystack.
      key: "pk_test_53bcf8edfaaac01c50bbbfe8d943eab06adeb8d0",
      // The customers gmail address.
      email: "Customers@gmail.com",
      // The amount the customer wants to pay
      amount: 10000,
      // The (NGN) stands for nigerian naria code currency which is NGN and is stands for naria
      currency: "NGN",
      // The ref the customer is paying for.
      // ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // The customers firstName.
      firstname: "john",
      // The customers lastName.
      lastname: "Doe",
      // Label: "Optional string that replaces customers email"
      // Metadata field can be define as a way to get extra information about the customer.
      metadata: {
        custom_fields: [
          {
            display_name: "Mobile Number",
            variable_name: "mobile_number",
            value: "+2348012345678"
          }
        ]
      },
      // This javascript function is called when the customer payment is successfull.
      callback: function (response) {
        alert("success. transaction ref is " + response.reference);
      },
      // This javascript function is invoked when the customer close the paystack window.
      onClose: function () {
        alert("window closed");
      }
    });

    let pay = handler.openIframe();
    dispatch({
      type: PAYMENT_STACK,
      payload: pay
    });
  };
};


export const GetShipingInfo = () => {
  
  return dispatch => {
    axios
      .get(apiUrl +
        "shipping"
      )
      .then(response => {
        
        dispatch({
          type: SHIPPING_INFO,
          payload: response.data
        });
      })
      .catch(error => {
    
        console.log(error, "i am the error 1");
      });
  };
};

export const placeOrder = (cart_id,shipping_id, user ) => {
  let bodyFormData = new FormData();
  bodyFormData.set("cart_id", cart_id);
  bodyFormData.set("shipping_id", shipping_id);
  bodyFormData.set("tax_id", 2);

  const options = {
    headers: {'Authorization': 'Bearer '+user.AccessToken}
  };
  return dispatch => {
    axios
      .post(apiUrl +
        "orders",
        bodyFormData,options
      )
      .then(response => {
        Swal.fire({
          title: "Order status",
          text: "Order placed successfully! Your order will be processed immediately!",
          icon: "success",
          showCancelButton: false,
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "COUTINUE",
          cancelButtonText: ""
        }).then(result => {
          localStorage.setItem('cartId', null);
        });
      })
      .catch(error => {
    
        console.log(error, "i am the error 1");
      });
  };
};

export const UpdateShipingInfo = (value) => {
  
  return dispatch => {
    
        dispatch({
          type: UPDATE_SHIPPING_INFO,
          payload: value
        });
      
  };
};
// PAYMENT FOR MY BANK PLATFORM
export const clickedPayBank = data => {
  return dispatch => {
    dispatch({
      type: PAYMENT_BANK,
      payload: data
    });
  };
};

// PAYMENT FOR MY CHECK PLATFORM
export const clickedPayCheck = data => {
  return dispatch => {
    dispatch({
      type: PAYMENT_CHECK,
      payload: data
    });
  };
};

// CHANGED_PAYMENT_TYPES
export const changePaymentTypes = data => {
  return dispatch =>
    dispatch({
      type: CHANGEPAYMENT_TYPES,
      payload: data
    });
};

// CheckPassword
export const checkPassword = (password, repeatPassword) => {
  if (password === repeatPassword) {
    return false;
  } else {
    return true;
  }
}