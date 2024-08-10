import React from 'react';
import mirImage from './img/mir.png';

const AboutUs = () => {
  return (
    <div className="bg-gray-fon text-purpleth p-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl text-blueth mb-4">About Paylink</h1>
        <p className="text-xl text-grayth">
          Paylink is a leading payment system operating not only in Russia but also globally. With over 10 years in the market, we are licensed and secure, offering the best services to our clients.
        </p>
      </section>

      <section className="flex flex-wrap justify-around mb-16">
        <div className="text-center max-w-xs mb-8">
          <img src={mirImage} alt="Secure" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Secure Transactions</h2>
          <p className="text-grayth">Your data is always safe with us, thanks to our top-notch security measures.</p>
        </div>
        <div className="text-center max-w-xs mb-8">
          <img src={mirImage} alt="Experience" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">10+ Years of Experience</h2>
          <p className="text-grayth">We have been providing reliable payment services for over a decade.</p>
        </div>
        <div className="text-center max-w-xs mb-8">
          <img src={mirImage} alt="Global" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Global Reach</h2>
          <p className="text-grayth">Our services are available worldwide, ensuring seamless transactions globally.</p>
        </div>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl text-blueth mb-4">Our Growth Over the Years</h2>
        <img src={mirImage} alt="Graph" className="mx-auto rounded-lg" />
      </section>

      <section className="text-center">
        <h2 className="text-3xl text-blueth mb-4">Meet Our Team</h2>
        <img src={mirImage} alt="Team" className="mx-auto rounded-lg" />
      </section>
    </div>
  );
};

export default AboutUs;
