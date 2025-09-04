import React from 'react'
import Layout from '../components/Layout/Layout'

const About = () => {
  return (
    <Layout title="About Us - Bhikha Bhai">
      <div className='container mx-auto px-4 py-10'>
        <h1 className='text-3xl font-bold text-center mb-8'>About Us</h1>

        <div className='max-w-3xl mx-auto text-center md:text-justify'>
        <p className='text-lg text-gray-700 leading-relaxed text-justify mb-4'>
          Welcome to <span className="font-semibold">Bhikha Bhai Jwery</span>, your
          trusted destination for premium gold, diamond, and platinum jewelry. 
          We take pride in offering elegant, timeless, and handcrafted pieces 
          that blend tradition with modern design.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mt-4 text-justify">
          Our mission is to deliver jewelry that not only enhances beauty but also
          carries emotional value for a lifetime. With years of expertise, we
          assure authenticity, purity, and the highest standards of craftsmanship.
        </p>
        </div>

      

        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div className='flex justify-center'>
          <img 
          className='rounded-lg shadow-lg w-full max-w-sm md:max-w-md md:max-w-lg'
          src="/src/assets/Jwe.jpg" alt="About Bhikha Bhai Jwery" />          
          </div>

          <div className='flex justify-center'>
          <img 
            className="rounded-lg shadow-lg w-full max-w-sm md:max-w-md md:max-w-lg"
          src="/src/assets/Jwe.jpg" alt="About Bhikha Bhai Jwery" />
          </div>

        </div>


      </div>
    </Layout>
  )
}

export default About
