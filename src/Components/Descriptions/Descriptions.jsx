import { useState } from 'react';
import './Descriptions.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';



const Descriptions = () => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'delivery', label: 'Delivery Policy' },
    { id: 'shipping', label: 'Shipping & Return' },
    { id: 'custom', label: 'Custom Tab' }
  ];

  return (
    <div className="container-fluid mt-5">
      <ul className="nav nav-tabs custom-tabs d-lfex gap-3">
              <Swiper
        slidesPerView={2}
        freeMode={true}
        modules={[FreeMode]}
        breakpoints={{
          688: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 4 },
        }}
          className={`mySwiper w-100`}
        >
        {tabs.map((tab) => (
          <SwiperSlide key={tab.id} >
          <li className="nav-item d-flex  align-items-end" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''} hover-underline border-0`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
          </SwiperSlide>
        ))}
        </Swiper>
      </ul>

      <div className="tab-content p-4">
        {activeTab === 'description' && (
          <div className="fade-in">
            <h5>Description</h5>
            <p>
              This is the product description. It provides detailed information about the product's features and specifications.
            </p>
          </div>
        )}
        {activeTab === 'delivery' && (
          <div className="fade-in">
            <h5>Delivery Policy</h5>
            <p>
              Our delivery policy ensures that your items are delivered safely and on time. Check our shipping options for more details.
            </p>
          </div>
        )}
        {activeTab === 'shipping' && (
          <div className="fade-in">
            <h5>Shipping & Return</h5>
            <p>
              We offer hassle-free returns and multiple shipping options. Review our policy to learn more.
            </p>
          </div>
        )}
        {activeTab === 'custom' && (
          <div className="fade-in">
            <h5>Custom Tab</h5>
            <p>
              This is a customizable tab where you can add any additional information or content you want to display.
            </p>
          </div>
        )}
      </div>
    </div>  );
};

export default Descriptions;