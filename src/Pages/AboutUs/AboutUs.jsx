import React from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs'
import './AboutUS.css'
import { Icon } from '@iconify/react/dist/iconify.js'
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Store } from 'lucide-react';

export default function AboutUs() {
    const [containerRef,  isInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [CEOref, CEOisInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ridingCartRef, ridingCartIsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [StoreRef, StoreisInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return (
    <div className='container'>
      <div className="bg-white custom-breadcrumbs">
      <h3 className='fw-bold'>About Us</h3>
      <Breadcrumbs/>
      </div>
      
      <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 0 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 2 }}
      className="introduction p-3 mt-5"
      >
        <p className='fw-bold'>Lorem ipsum dolor sit am et, consectetur adipiscing elit. Etiam consequat ut ex vel finibus. Nunc eget molestie purus. Fusce imperdiet pulvinar est, eget fermentum nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae</p>

        <p className='fw-light'>Maecenas congue metus id turpis iaculis mattis. Sed pellentesque id arcu id scelerisque.
          Ut ullamcorper rutrum justo, at blandit eros maximus ut. Integer non tincidunt justo
          , rhoncus Aenean venenatis sed purus ac sollicitudin.
          Nulla mauris risus, commodo et luctus rutrum, lobortis sed mauris.
          Integer congue, sem elementum varius tristique, erat nulla rutrum risus, 
          a imperdiet nulla lorem fermentum erat. Pellentesque elementum justo at velit fringilla, eu feugiat erat 
          fermentum. Vivamus libero dolor, porta eget vehicula eu, iaculis id lacus.
          Sed interdum convallis sapien, eget faucibus sapien. Proin hendrerit lacus turpis.
          Maecenas congue metus id turpis iaculis mattis. Sed pellentesque id arcu id scelerisque. Ut ullamcorper rutrum justo, at blandit
          eros maximus ut. Integer non tincidunt justo, rhoncus Aenean venenatis sed purus ac sollicitudin. Nulla mauris risus, commodo et luctus rutrum, lobortis sed mauris.</p>
      </motion.div>


        <motion.div
        ref={CEOref}
        initial={{ opacity: 0, y: 70 }}
        animate={CEOisInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1}}
        className='CEO d-flex mb-5 gap-3'
        >
          <Icon style={{color: '#c1c1c1',}} icon="tdesign:quote-filled" width="80" height="40" />
          <div>
            <p className='fs-5'>Best purchase I’ve made this winter! The color and knitting are exquisite and it's so comfy! Went from NYC to Miami without ever taking it off. Super cute!!</p>
            <p className='fw-bold'>Kwang Shang. - CEO Vinovathemes</p>
          </div>
        </motion.div>

        <motion.div
        ref={ridingCartRef}
        initial={{ opacity: 0, x: -100 }}
        animate={ridingCartIsInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="riding-cart mt-5 d-flex flex-column flex-lg-row align-items-center gap-5">
          <div className='w-100'>
            <p className='fw-bold'>Why choose us ?</p>
            <p className=''>Maecenas congue metus id turpis iaculis mattis. Sed pellentesque id arcu id scelerisque. Ut ullamcorper rutrum justo, at blandit eros maximus ut. Integer non tincidunt justo, rhoncus Aenean venenatis sed purus ac sollicitudin. Nulla mauris risus, commodo et luctus rutrum, lobortis sed mauris. Integer congue, sem elementum varius tristique.</p>
          </div>
          <img className='w-100' src="./images/riding-cart.jpg" alt="" />
        </motion.div>

<hr />

        <motion.div
        ref={StoreRef}
        initial={{ opacity: 0, x: 100 }}
        animate={StoreisInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="riding-cart mt-5 d-flex flex-column flex-lg-row align-items-center gap-5"
        >
          <img className='w-100' src="./images/online-shopping.jpg" alt="" />
          <div className='w-100'>
            <p className='fw-bold'>Trusted online shopping</p>
            <p className=''>
            Maecenas congue metus id turpis iaculis mattis. Sed pellentesque id arcu id scelerisque. Ut ullamcorper rutrum justo, at blandit eros maximus ut. Integer non tincidunt justo, rhoncus Aenean venenatis sed purus ac sollicitudin. Nulla mauris risus, commodo et luctus rutrum, lobortis sed mauris. Integer congue, sem elementum varius tristique.
            </p>
          </div>
        </motion.div>


    </div>
  )
}
