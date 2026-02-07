import CartItems from './cartItems/cartItems';

const CartPage = () => {
  return (
    <section>
      <div className="mx-auto max-w-330 px-6 py-6">
        <h1 className="text-lg font-bold">Shopping Cart</h1>
        <div className="bg-white rounded-lg p-6 m-6">
          <CartItems />
        </div>
      </div>
    </section>
  );
};

export default CartPage;
