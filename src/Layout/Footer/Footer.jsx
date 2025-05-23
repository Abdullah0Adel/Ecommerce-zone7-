import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import './Footer.css'
import { Icon } from '@iconify/react/dist/iconify.js';

const Footer = () => {
  return (
    <footer className="footerImg text-white pb-5" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/images/soccer-grass.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Container fluid className="px-4 py-5">
        <Row className="mb-5">
          {/* Logo and About */}
          <Col lg={6} md={12} className="mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <img src="/images/Zone7-logoFooter.png" alt="Zone7 Logo" className='footer-logo'/>
            </div>
            <p className="mb-4" style={{ fontSize: '0.9rem' }}>
              Sed non risus. Suspendisse lectus tortor, dignissim sit amet, at adipiscing elit. Donec fringilla quam vitae est mattis, eget dapibus commodo. Integer ultricorper ultricies magna, id gravida augue fringilla ac.
            </p>
            <div className="d-flex gap-3 mb-4">
              <a href="" className="text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <Icon icon="gg:facebook" width="24" height="24" />
              </a>
              <a href="#" className="text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <Icon icon="line-md:instagram" width="24" height="24" />
              </a>
              <a href="#" className="text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <Icon icon="prime:twitter" width="14" height="14" />
              </a>
              <a href="#" className="text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <Icon icon="mdi:pinterest" width="24" height="24" />
              </a>
            </div>
          </Col>

          {/* Contact Us */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="mb-4 fw-bold">Contact us</h5>
            <div className="d-flex align-items-start mb-3 gap-3">
              <Icon icon="mdi:location" width="24" height="24" />
              <p className="mb-0 fw-light">2357 Gordon Street, CA</p>
            </div>
            <div className="d-flex align-items-start mb-3 gap-3">
              <Icon icon="ic:baseline-phone" width="24" height="24" />
              <p className="mb-0 fw-light">+ 909-478-2742</p>
            </div>
            <div className="d-flex align-items-start mb-3 gap-3">
              <Icon icon="material-symbols:mail" width="24" height="24" />
              <p className="mb-0 fw-light">cannabuzz12.net@company.com</p>
            </div>
          </Col>

          {/* Customer Service */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="mb-4 fw-bold">Customer service</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none fw-light">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none fw-light">Term Of Use</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none fw-light">Delivery</a></li>
            </ul>
          </Col>


        </Row>

        <hr className="my-4" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <small>Copyright © 2024 Vinovathemes. All rights reserved.</small>
          </Col>
        </Row>
      </Container>

      {/* Back to top button */}
      <div className="position-fixed end-0 bottom-0 p-3" style={{ zIndex: 11 }}>
        <a 
          href="#top" 
          className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center shadow"
          style={{ width: '40px', height: '40px' }}
        >
          <FaArrowUp />
        </a>
      </div>
    </footer>
  );
};

export default Footer;