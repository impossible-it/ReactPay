const FooterTur = () => {
  return (
    <footer className="bg-white shadow-md py-8">
      <div className="container mx-auto flex flex-col-reverse md:flex-row justify-between items-start md:space-x-8 space-y-8 md:space-y-0">
        <div className="w-full md:w-3/8 text-gray-700 text-left px-4">
          <div className="md:mt-0 mt-6">
            <p className="mb-3 md:mb-6 text-xs text-blueth">Merkez Bankası Lisansı</p>
            <p className="mb-3 md:mb-6 text-xs text-blueth">Teklif Sözleşmesi</p>
            <p className="mb-6 text-xs text-blueth">Kullanım Şartları</p>
          </div>
          <p className="mb-3 md:mb-6 text-xs w-full"> İsviçre, Zugerbergstrasse 41B, 6300 Zug</p>
          <div className="flex flex-col items-start">
            <img src={logo} alt="Paylink Logo" className="h-[32px] mb-2" />
            <div className='flex flex-row items-center my-1'>
              <p className='text-xs font-thin'>Telif Hakkı</p>
              <img src={copyright} alt="Paylink Telif Hakkı" className="h-3 w-3 mx-1" />
              <p className='mr-1 font-bold text-purple-950'> Paylink</p>
              <p className='mx-1 font-thin text-xs'>2024</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-3/8 px-4">
          <p className="mb-6 text-xs text-grayth">
            Genel Bankacılık İşlemleri Lisansı No. 1481, 11.08.2015.
          </p>
          <p className="mb-6 text-xs text-grayth">
            Paylink'in Interfax ajansındaki bilgi açıklama sayfası
          </p>
          <p className="mb-6 text-xs text-grayth">
            Profesyonel menkul kıymetler piyasası katılımcısı olarak bilgi açıklaması
          </p>
          <p className="mb-6 text-xs text-grayth">
            Bireylerle yapılan banka mevduat anlaşmalarında faiz oranları hakkında bilgi
          </p>
          <p className="mb-3 md:mb-4 text-xs text-grayth">
            Bilgilendirme kaynağı önerilen teknolojileri kullanır
          </p>
        </div>
        <div className="w-full md:w-2/8 px-4">
          <p className="mb-6 text-xs font-bold">Hakkımızda</p>
          <p className="mb-6 text-xs font-bold">Hizmetler</p>
          <p className="mb-6 text-xs font-bold">İletişim</p>
          <p className="mb-6 text-xs font-bold">Destek</p>
          <p className="text-xs font-bold">Veri Koruma</p>
        </div>
        <div className="w-full md:w-1/4 flex justify-center md:justify-start px-4">
          <div className="flex flex-col items-center space-y-4">
            <img src={paypal} alt="PayPal" className="h-4 w-14" />
            <img src={visa} alt="Visa" className="w-8" />
            <img src={mastercard} alt="MasterCard" className="w-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTur;