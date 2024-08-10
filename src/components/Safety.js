import React from 'react';
import mirImage from './img/mir.png';

const DataProtection = () => {
  return (
    <div className="bg-gray-fon text-purpleth p-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl text-blueth mb-4">Data Protection</h1>
        <p className="text-xl text-grayth">
          We take the protection of your personal data seriously. Here are some of the ways we ensure your data is secure.
        </p>
      </section>

      <section className="flex flex-wrap justify-around mb-16">
        <div className="text-center max-w-xs mb-8">
          <img src={mirImage} alt="Encryption" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Encryption</h2>
          <p className="text-grayth">All your data is encrypted using the latest technology to prevent unauthorized access.</p>
        </div>
        <div className="text-center max-w-xs mb-8">
          <img src={mirImage} alt="Secure Servers" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Secure Servers</h2>
          <p className="text-grayth">We use secure servers to store your data, ensuring it is always protected.</p>
        </div>
        <div className="text-center max-w-xs mb-8">
          <img src={mirImage} alt="Regular Audits" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Regular Audits</h2>
          <p className="text-grayth">Our systems are regularly audited to ensure compliance with the highest security standards.</p>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl text-blueth mb-4">Related Documents</h2>
        <ul className="list-none">
          <li className="mb-2"><a href="https://example.com/document1" className="text-blueth hover:underline">Privacy Policy</a></li>
          <li className="mb-2"><a href="https://example.com/document2" className="text-blueth hover:underline">Terms of Service</a></li>
          <li><a href="https://example.com/document3" className="text-blueth hover:underline">Data Processing Agreement</a></li>
        </ul>
      </section>
    </div>
  );
};

export default DataProtection;
