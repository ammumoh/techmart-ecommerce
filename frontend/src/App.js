import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import OrderConfirmation from './OrderConfirmation';
import OrdersPage from './OrdersPage';
import AdminDashboard from './AdminDashboard';
import raspberryImage from './hero.webp';
import arduinoImage from './arduino.webp';
import temperatureSensorImage from './temperature sensor.jpg';
import solderingIronImage from './electric soldering iron kit.jpg';
import ultrasonicSensorImage from './ultrasonic sensor.jpg';
import servoMotorImage from './servo motor.jpg';
import breadboardKitImage from './breadboard kit.png';
import digitalMultimeterImage from './digitalmultimeter.avif';

function App() {
  // ========== AUTHENTICATION STATE ==========
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // ========== OTHER STATE ==========
  const [cartItems, setCartItems] = useState([]);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [orderForm, setOrderForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    quantity: 1,
    deliveryAddress: '',
    city: '',
    specialInstructions: ''
  });

  // ========== CHECK IF USER IS ALREADY LOGGED IN ==========
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // ========== AUTHENTICATION FUNCTIONS ==========
  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleRegister = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    window.location.reload();
  };

  // ========== FEATURED PRODUCTS ==========
  const featuredProducts = [
    { 
      id: 1, 
      name: 'Arduino Uno R3', 
      price: 3500,
      image: arduinoImage,
      category: 'kits', 
      featured: true,
      description: 'The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, an ICSP header, and a reset button.',
      specifications: ['Microcontroller: ATmega328P', 'Operating Voltage: 5V', 'Input Voltage: 7-12V', 'Digital I/O Pins: 14', 'Analog Input Pins: 6', 'Clock Speed: 16 MHz']
    },
    { 
      id: 2, 
      name: 'Raspberry Pi 4', 
      price: 10500,
      image: raspberryImage,
      category: 'kits', 
      featured: true,
      description: 'Raspberry Pi 4 Model B is the latest product in the popular Raspberry Pi range of computers. It offers ground-breaking increases in processor speed, multimedia performance, memory, and connectivity compared to the prior generation.',
      specifications: ['Processor: Broadcom BCM2711', 'CPU: Quad-core Cortex-A72 @ 1.5GHz', 'RAM: 2GB/4GB/8GB', 'USB: 2x USB 3.0, 2x USB 2.0', 'Video: 2x micro-HDMI', 'Network: Gigabit Ethernet']
    },
    { 
      id: 3, 
      name: 'Temperature Sensor', 
      price: 1500,
      image: temperatureSensorImage,
      category: 'sensors', 
      featured: true,
      description: 'High-precision temperature and humidity sensor module for Arduino and other microcontroller projects. Features DHT22/AM2302 sensor with digital output.',
      specifications: ['Type: Digital Temperature & Humidity Sensor', 'Temperature Range: -40°C to 80°C', 'Humidity Range: 0-100% RH', 'Resolution: 0.1°C', 'Operating Voltage: 3-5V']
    },
    { 
      id: 4, 
      name: 'Soldering Iron Kit', 
      price: 5500,
      image: solderingIronImage,
      category: 'tools', 
      featured: true,
      description: 'Complete soldering kit with temperature-controlled soldering iron, stand, and accessories for electronics assembly and repair work.',
      specifications: ['Power: 60W', 'Temperature Range: 200-480°C', 'Display: LCD Screen', 'Includes: 5 Tips', 'Voltage: 220V']
    },
    { 
      id: 5, 
      name: 'Ultrasonic Sensor', 
      price: 1200,
      image: ultrasonicSensorImage,
      category: 'sensors', 
      featured: true,
      description: 'HC-SR04 Ultrasonic Sensor module for distance measurement up to 4 meters. Perfect for robotics, obstacle avoidance, and proximity detection projects.',
      specifications: ['Type: Ultrasonic Distance Sensor', 'Range: 2cm - 400cm', 'Resolution: 0.3cm', 'Frequency: 40KHz', 'Operating Voltage: 5V DC']
    },
    { 
      id: 6, 
      name: 'Servo Motor', 
      price: 1800,
      image: servoMotorImage,
      category: 'accessories', 
      featured: true,
      description: 'High-quality SG90 micro servo motor for robotics and hobby projects. Features precise control and quiet operation.',
      specifications: ['Type: Micro Servo', 'Operating Voltage: 4.8-6V', 'Torque: 2.5kg/cm', 'Weight: 9g', 'Rotation: 180°']
    },
    { 
      id: 7, 
      name: 'Breadboard Kit', 
      price: 2500,
      image: breadboardKitImage,
      category: 'kits', 
      featured: true,
      description: 'Complete breadboard kit with 830-point breadboard, jumper wires, and essential components for prototyping and testing circuits.',
      specifications: ['Points: 830 Tie-points', 'Type: Solderless', 'Jumper Wires: 65 pieces', 'Power Rails: 2', 'Material: ABS Plastic']
    },
    { 
      id: 8, 
      name: 'Digital Multimeter', 
      price: 4800,
      image: digitalMultimeterImage,
      category: 'tools', 
      featured: true,
      description: 'Professional digital multimeter with auto-ranging and multiple measurement functions for electronics testing and diagnostics.',
      specifications: ['Display: 4-digit LCD', 'Voltage: AC/DC up to 600V', 'Current: AC/DC up to 10A', 'Resistance: up to 60MΩ', 'Features: Auto-ranging, Backlit']
    },
  ];

  // ========== NAVIGATION FUNCTIONS ==========
  const navigateToOrders = () => {
    setShowOrders(true);
  };

  const handleBackFromOrders = () => {
    setShowOrders(false);
  };

  const navigateToAdmin = () => {
    setShowAdmin(true);
  };

  const handleBackFromAdmin = () => {
    setShowAdmin(false);
  };

  // ========== ORDER FUNCTIONS ==========
  const addToCartWithDetails = async () => {
    if (!orderForm.fullName || !orderForm.email || !orderForm.phone || !orderForm.deliveryAddress || !orderForm.city) {
      alert('Please fill in all required fields (including City)');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        user: orderForm.fullName,
        orderItems: [
          {
            product: String(selectedProduct.id),
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: orderForm.quantity,
            image: typeof selectedProduct.image === 'string' ? selectedProduct.image : 'placeholder.jpg'
          }
        ],
        shippingAddress: {
          address: orderForm.deliveryAddress,
          city: orderForm.city,
          phone: orderForm.phone,
          email: orderForm.email,
          specialInstructions: orderForm.specialInstructions
        },
        paymentMethod: 'Cash on Delivery',
        totalPrice: selectedProduct.price * orderForm.quantity
      };

      console.log('📦 Sending order data:', orderData);

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      let createdOrder;
      try {
        createdOrder = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error(`Server returned: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(createdOrder.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Order created successfully:', createdOrder);
      
      setOrderConfirmation(createdOrder);
      setShowConfirmation(true);
      
      const newItem = {
        ...selectedProduct,
        quantity: orderForm.quantity,
        orderId: createdOrder._id,
        customerDetails: {
          fullName: orderForm.fullName,
          email: orderForm.email,
          phone: orderForm.phone,
          deliveryAddress: orderForm.deliveryAddress,
          city: orderForm.city,
          specialInstructions: orderForm.specialInstructions
        }
      };

      setCartItems([...cartItems, newItem]);
      
      setShowProductDetail(false);
      setSelectedProduct(null);
      setOrderForm({
        fullName: '',
        email: '',
        phone: '',
        quantity: 1,
        deliveryAddress: '',
        city: '',
        specialInstructions: ''
      });
      
    } catch (error) {
      console.error('❌ Error placing order:', error);
      
      let errorMessage = 'Failed to place order. Please try again.\n\n';
      if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
        errorMessage += '⚠️ Cannot connect to the server.\n';
        errorMessage += 'Make sure your backend server is running on http://localhost:5000\n\n';
        errorMessage += 'To start the backend:\n';
        errorMessage += '1. Open a terminal in your backend folder\n';
        errorMessage += '2. Run: npm start\n';
        errorMessage += '3. Then try again';
      } else if (error.message.includes('validation failed')) {
        errorMessage += '⚠️ Validation Error:\n';
        const match = error.message.match(/Path `([^`]+)` is required/g);
        if (match) {
          errorMessage += match.join('\n');
        } else {
          errorMessage += error.message;
        }
        errorMessage += '\n\nPlease check all fields and try again.';
      } else if (error.message) {
        errorMessage += `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToShop = () => {
    setShowConfirmation(false);
    setOrderConfirmation(null);
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
    setOrderForm({
      ...orderForm,
      quantity: 1
    });
  };

  const closeProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value
    });
  };

  const toggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setIsDashboardOpen(false);
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      kits: '📦',
      accessories: '🎮',
      tools: '🛠️',
      sensors: '📡',
      all: '📋'
    };
    return icons[category] || '📋';
  };

  const getCategoryTitle = (category) => {
    const titles = {
      kits: 'Electronics Kits',
      accessories: 'Accessories',
      tools: 'Tools & Equipment',
      sensors: 'Sensors & Modules',
      all: 'All Products'
    };
    return titles[category] || category;
  };

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ========== RENDER LOGIC ==========
  
  // If showing login page
  if (showLogin) {
    return <Login onLogin={handleLogin} onSwitchToRegister={() => {
      setShowLogin(false);
      setShowRegister(true);
    }} />;
  }

  // If showing register page
  if (showRegister) {
    return <Register onRegister={handleRegister} onSwitchToLogin={() => {
      setShowRegister(false);
      setShowLogin(true);
    }} />;
  }

  // If showing confirmation page
  if (showConfirmation && orderConfirmation) {
    return (
      <OrderConfirmation 
        order={orderConfirmation} 
        onBackToShop={handleBackToShop} 
      />
    );
  }

  // If showing orders page
  if (showOrders) {
    return <OrdersPage onBackToShop={handleBackFromOrders} />;
  }

  // If showing admin dashboard
  if (showAdmin) {
    return <AdminDashboard onBackToShop={handleBackFromAdmin} />;
  }

  // ========== MAIN SHOP RENDER ==========
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>TechMart</h2>
          <p className="sidebar-subtitle">Electronics Store</p>
        </div>
        
        {/* User Authentication Section */}
        <div className="sidebar-user">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">{currentUser?.name}</span>
              <span className="user-email">{currentUser?.email}</span>
              <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
            </div>
          ) : (
            <>
              <button className="login-btn" onClick={() => setShowLogin(true)}>🔐 Login</button>
              <button className="register-btn" onClick={() => setShowRegister(true)}>📝 Register</button>
            </>
          )}
        </div>
        
        {/* My Orders Button */}
        <div className="sidebar-orders-btn">
          <button className="orders-nav-btn" onClick={navigateToOrders}>
            📋 My Orders
          </button>
        </div>

        {/* Admin Panel Button - Only show if user is admin */}
        {isAuthenticated && currentUser?.isAdmin && (
          <div className="sidebar-admin-btn">
            <button className="admin-nav-btn" onClick={navigateToAdmin}>
              🛠️ Admin Panel
            </button>
          </div>
        )}

        <button 
          className={`hyphens-btn ${isDashboardOpen ? 'active' : ''}`}
          onClick={toggleDashboard}
          aria-label="Toggle menu"
        >
          <div className="hyphens-container">
            <span className="hyphen"></span>
            <span className="hyphen"></span>
            <span className="hyphen"></span>
          </div>
        </button>

        <div className={`categories-dropdown ${isDashboardOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-label">Categories</h3>
              {['all', 'kits', 'accessories', 'tools', 'sensors'].map((category) => (
                <button
                  key={category}
                  className={`nav-item ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <span className="nav-icon">{getCategoryIcon(category)}</span>
                  <span className="nav-text">{getCategoryTitle(category)}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="cart-summary">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cartItems.length}</span>
          </div>
          <p className="footer-text">© 2026 TechMart</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-container">
            <div className="floating-icons">
              <span className="float-icon" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🔧</span>
              <span className="float-icon" style={{ top: '20%', right: '10%', animationDelay: '2s' }}>🖥️</span>
              <span className="float-icon" style={{ bottom: '30%', left: '8%', animationDelay: '4s' }}>🌡️</span>
              <span className="float-icon" style={{ bottom: '20%', right: '5%', animationDelay: '1s' }}>🔥</span>
              <span className="float-icon" style={{ top: '50%', left: '50%', animationDelay: '3s' }}>📡</span>
              <span className="float-icon" style={{ top: '5%', left: '30%', animationDelay: '5s' }}>⚙️</span>
              <span className="float-icon" style={{ bottom: '10%', left: '40%', animationDelay: '2.5s' }}>🔌</span>
              <span className="float-icon" style={{ top: '60%', right: '20%', animationDelay: '4.5s' }}>📊</span>
            </div>

            <div className="hero-content-wrapper">
              <div className="hero-text-content">
                <h1 className="hero-title">
                  Welcome to <span className="gradient-text">TechMart</span>
                </h1>
                <p className="hero-subtitle">
                  Your Ultimate Electronics & Components Store
                </p>
                <p className="hero-description">
                  Discover premium quality Arduino boards, Raspberry Pi, sensors, 
                  and all the tools you need for your next project
                </p>
                <div className="hero-buttons">
                  <button className="btn-primary" onClick={() => scrollToSection('products')}>
                    Explore Products
                  </button>
                  <button className="btn-secondary" onClick={() => scrollToSection('about')}>
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="featured-section" id="products">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked selection of our best electronics</p>
          </div>
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="featured-card" onClick={() => openProductDetail(product)}>
                <div className="featured-image">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image-real"
                    loading="lazy"
                  />
                  <div className="featured-badge">Featured</div>
                </div>
                <div className="featured-info">
                  <h3 className="featured-name">{product.name}</h3>
                  <p className="featured-category">{product.category}</p>
                  <div className="featured-footer">
                    <span className="featured-price">{formatPrice(product.price)}</span>
                    <button className="add-to-cart-btn-small">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="about-section" id="about">
          <div className="about-container">
            <div className="about-content">
              <h2>About TechMart</h2>
              <p className="about-description">
                TechMart was founded with a simple mission: to make electronics and 
                components accessible to makers, hobbyists, and professionals alike.
              </p>
              <div className="about-grid">
                <div className="about-item">
                  <span className="about-icon">🔬</span>
                  <h4>Quality Components</h4>
                  <p>Premium grade electronics from trusted manufacturers</p>
                </div>
                <div className="about-item">
                  <span className="about-icon">🚀</span>
                  <h4>Fast Shipping</h4>
                  <p>Quick delivery to get your projects started right away</p>
                </div>
                <div className="about-item">
                  <span className="about-icon">💡</span>
                  <h4>Expert Support</h4>
                  <p>Technical support to help you with your projects</p>
                </div>
                <div className="about-item">
                  <span className="about-icon">🛡️</span>
                  <h4>Warranty</h4>
                  <p>All products come with a satisfaction guarantee</p>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="about-icons-grid">
                <span className="about-float-icon">🔧</span>
                <span className="about-float-icon">🖥️</span>
                <span className="about-float-icon">🌡️</span>
                <span className="about-float-icon">🔥</span>
                <span className="about-float-icon">📡</span>
                <span className="about-float-icon">⚙️</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="main-footer">
          <p>© 2026 TechMart - Your trusted electronics partner</p>
          <div className="footer-links">
            <span>About</span>
            <span>Contact</span>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </footer>
      </main>

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className="modal-overlay" onClick={closeProductDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProductDetail}>×</button>
            
            <div className="modal-product-info">
              <div className="modal-product-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-product-details">
                <h2>{selectedProduct.name}</h2>
                <p className="modal-product-price">{formatPrice(selectedProduct.price)}</p>
                <p className="modal-product-category">{selectedProduct.category}</p>
                <p className="modal-product-description">{selectedProduct.description}</p>
                
                <div className="modal-specifications">
                  <h4>Specifications:</h4>
                  <ul>
                    {selectedProduct.specifications.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-order-form">
              <h3>Order Details</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={orderForm.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={orderForm.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderForm.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Address *</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={orderForm.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your delivery address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={orderForm.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <div className="quantity-control">
                    <button 
                      type="button" 
                      onClick={() => setOrderForm({...orderForm, quantity: Math.max(1, orderForm.quantity - 1)})}
                    >
                      -
                    </button>
                    <span>{orderForm.quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => setOrderForm({...orderForm, quantity: orderForm.quantity + 1})}
                    >
                      +
                    </button>
                  </div>
                  <small style={{color: '#666', display: 'block', marginTop: '0.3rem'}}>
                    Total: {formatPrice(selectedProduct.price * orderForm.quantity)}
                  </small>
                </div>

                <div className="form-group">
                  <label>Special Instructions</label>
                  <textarea
                    name="specialInstructions"
                    value={orderForm.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery"
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-add-to-cart" 
                    onClick={addToCartWithDetails}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ Placing Order...' : '🛒 Place Order'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={closeProductDetail}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;