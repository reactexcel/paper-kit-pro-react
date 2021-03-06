import Router from "next/router";
import { connect } from "react-redux";
import { Layout } from "../layout";
import { Cart, DeliveryCard } from "../components/cart";
import {
  DailySpecial,
  Menu,
  MenuBanner,
  MenuCategory,
} from "../components/menu";
import { addToCart, removeFromCart } from "../store/action/action";
import { Button, Modal } from "reactstrap";

const Home = (props) => {
  const [showDeliveryMessage, setShowDeliveryMessage] = React.useState(false);
  const [showMobileCart, setShowMobileCart] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [items, setItems] = React.useState(0);

  const computeCart = () => {
    const subtotal = Number(
      props.cart.reduce((total, item) => total + item.price * item.quantity, 0)
    );

    const tax = Number(subtotal * 0.1);
    const total = Number(subtotal + tax);

    setItems(props.cart.reduce((sum, item) => sum + item.quantity, 0));
    setTotal(total.toFixed(2));
  };

  React.useEffect(() => {
    computeCart();
  }, [props.cart]);

  const addToCart = (value) => {
    props.addToCart(value, props.cart);
  };

  const removeFromCart = (value) => {
    props.removeFromCart(value, props.cart);
  };

  const checkEverything = () => {
    if (props.day && props.time) {
      Router.push("/checkout");
    } else {
      setShowDeliveryMessage(true);
    }
  };

  return (
    <Layout>
      <MenuBanner restaurantData={props.restaurantData} />
      <div className="d-block d-sm-none d-lg-none">
        <DeliveryCard />
      </div>
      <MenuCategory categories={props.categories} />
      <div className="container">
        <div className="row text-center">
          <div className="col-md-8">
            <h3
              className="mb-4"
              style={{
                color: "#323232",
                fontWeight: "500",
                textAlign: "left",
              }}
            >
              Menu{" "}
            </h3>
            <br />
            <DailySpecial />
            <Menu addToCart={addToCart} />
          </div>
          <div className="col-md-4">
            <div
              className="d-none d-md-block d-lg-block d-xl-block"
              style={{ marginTop: "25%" }}
            >
              <DeliveryCard />
              <h3 style={{ margin: "50px 0px" }}>Your Cart</h3>
              <Cart
                isMenu={true}
                getValue={addToCart}
                minusValue={removeFromCart}
                checkEverything={checkEverything}
                showMessage={showDeliveryMessage}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed-bottom d-block d-sm-none d-lg-none">
        <Button
          onClick={() => setShowMobileCart(!showMobileCart)}
          style={{
            textAlign: "left",
            backgroundColor: "#F08B2A",
            border: "none",
          }}
          size="lg"
          block
        >
          CHECKOUT ({items} ITEMS)
          <span className="float-right">${total}</span>
        </Button>
      </div>
      {showMobileCart && (
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "fixed",
            zIndex: 10000,
            left: 0,
            top: 0,
            overflowX: "hidden",
            backgroundColor: "white",
          }}
        >
          <Cart
            isMenu={true}
            isMobile={true}
            getValue={addToCart}
            minusValue={removeFromCart}
            checkEverything={checkEverything}
            showMessage={showDeliveryMessage}
            setShowMobileCart={setShowMobileCart}
          />
        </div>
      )}
    </Layout>
  );
};

function mapStateToProps(state) {
  const categories = state.store.payload.map((item) => item.category);
  return {
    cart: state.cartReducer.cart,
    restaurantData: state.store.restaurantData,
    categories,
    day: state.store.day,
    time: state.store.time,
  };
}

function mapDispatchToProp(dispatch) {
  return {
    addToCart: (value, state) => {
      dispatch(addToCart(value, state));
    },
    removeFromCart: (value, state) => {
      dispatch(removeFromCart(value, state));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProp)(Home);
