import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ImageUpload from './Pages/ImageUpload';
import ImageResizer from './Pages/ImageResizer'; // Ensure the path is correct
import PdfMerger from './Pages/PdfMerger';
import './App.css';

const App = ({ back }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  console.log('backk', back)

  const handleImageUpload = (file) => {
    setSelectedImage(URL.createObjectURL(file));
  };

  return (
    <Router>
      <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand d-flex" href="#">
            <img src="https://www.reduceimages.com/img/reduce_logo.png" alt="" width="80%" height="50" class="d-inline-block align-text-top" style={{ background: 'transparent' }} />
            {/* <span className='mx-3'>Image Resizer</span> */}
          </a>
        </div>
      </nav>
      <div className="">
        {/* <header>
          <nav>
            <Link to="/merge-pdfs">
              <button>Select PDFs</button>
            </Link>
          </nav>
        </header> */}
        <main>
          <Routes>
            <Route
              path="/"
              element={
                !selectedImage ? (
                  <ImageUpload onUpload={handleImageUpload} />
                ) : (
                  <ImageResizer selectedImage={selectedImage} />
                )
              }
            />
            <Route path="/merge-pdfs" element={<PdfMerger />} />
          </Routes>
        </main>
      </div>
      {/* <!-- fontawesome is beign ised for social icons --> */}
      <footer class="footer bg-light" role="contentinfo" itemscope itemtype="http://schema.org/WPFooter">
        {/* <div class="social" role="navigation" aria-labelledby="social-heading">
    <h3 id="social-heading" class="sr-only">Follow us on social media</h3>
    <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
    <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
    <a href="#" aria-label="Mastodon"><i class="fa-brands fa-mastodon"></i></a>
    <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
  </div> */}
        {/* <hr class="footer-break"/> */}
        <ul class="footer-links" role="navigation" aria-labelledby="footer-links-heading">
          <h3 id="footer-links-heading" class="sr-only">Footer Links</h3>
          <li><a href="#">Site Home</a></li>
          <li><a href="#">Playground</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Sitemap</a></li>
          <li><a href="#">Contents</a></li>
        </ul>
        <p class="copyright">© Conect with developer - rssaini7976@gmail.com</p>
      </footer>
    </Router>
  );
};

export default App;
