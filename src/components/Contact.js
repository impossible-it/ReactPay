import React from 'react';
import mirImage from './img/mir.png';

const Contacts = () => {
  return (
    <div className="bg-gray-fon text-purpleth p-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl text-blueth mb-4">Contact Us</h1>
        <p className="text-xl text-grayth">
          We are available 24/7 to assist you. Feel free to reach out to us at any time.
        </p>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl text-blueth mb-4">Our Office</h2>
        <p className="text-xl text-grayth mb-4">Russia, 117648, Moscow, Chertanovo Severnoye, 1A, bld. 1</p>
        <p className="text-xl text-grayth">Email: support@paylink.com</p>
      </section>

      <section className="text-center">
        <h2 className="text-3xl text-blueth mb-4">Our Location</h2>
        <img src={mirImage} alt="Google Map" className="mx-auto rounded-lg" />
      </section>
    </div>
  );
};

export default Contacts;
