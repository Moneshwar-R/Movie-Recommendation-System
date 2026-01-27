import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://127.0.0.1:8000';

// Mock movie database for UI


// Main App Router
const CineMindApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [favouriteMovies, setFavouriteMovies] = useState([]);

  const navigate = (page) => setCurrentPage(page);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <LandingPage key="landing" navigate={navigate} />
        )}
        {currentPage === 'auth' && (
          <AuthPage key="auth" navigate={navigate} setUser={setUser} />
        )}
        {currentPage === 'onboarding' && (
          <OnboardingPage key="onboarding" navigate={navigate} setFavourites={setFavouriteMovies} />
        )}
        {currentPage === 'home' && (
          <HomePage 
            key="home" 
            navigate={navigate} 
            user={user} 
            watchedMovies={watchedMovies} 
            setWatchedMovies={setWatchedMovies} 
            favouriteMovies={favouriteMovies} 
          />
        )}
        {currentPage === 'profile' && (
          <ProfilePage 
            key="profile" 
            navigate={navigate} 
            user={user} 
            watchedMovies={watchedMovies} 
            favouriteMovies={favouriteMovies} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Landing Page
const LandingPage = ({ navigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(147,51,234,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-7xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            CineMind
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            AI-Powered Movie Recommendations That Know Your Taste
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <button
            onClick={() => navigate('auth')}
            className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            Get Started
          </button>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {['AI Personalization', 'Smart Tracking', 'Taste Analytics'].map((feature, i) => (
            <div key={i} className="text-center">
              <div className="text-purple-400 text-3xl mb-2">✨</div>
              <p className="text-sm text-gray-400">{feature}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Auth Page
const AuthPage = ({ navigate, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = () => {
    setUser({ name: formData.name || 'Movie Lover', email: formData.email });
    navigate('onboarding');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900/20 to-black px-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Join CineMind'}
          </h2>

          <div className="space-y-5">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-white"
                />
              </motion.div>
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-white"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <p className="mt-6 text-center text-gray-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Onboarding Page
const OnboardingPage = ({ navigate, setFavourites }) => {
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        console.log('Fetching movies from:', `${API_BASE}/recommend/all`);
        const response = await fetch(`${API_BASE}/recommend/all`);
        console.log('Response status:', response.status);
        const movieTitles = await response.json();
        console.log('Fetched movie titles:', movieTitles);
        // Convert titles to movie objects with basic info
        const movieObjects = movieTitles.map((title, index) => ({
          id: index + 1,
          title: title,
          year: 2020, // Default year
          genres: ['Drama'], // Default genre
          rating: 8.0, // Default rating
          poster: `https://picsum.photos/300/450?random=${index}`
        }));
        console.log('Created movie objects:', movieObjects.length);
        setAllMovies(movieObjects);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setAllMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } else {
      setSearchResults([]);
    }
  };

  const toggleMovie = (movie) => {
    if (selected.find(m => m.id === movie.id)) {
      setSelected(selected.filter(m => m.id !== movie.id));
    } else if (selected.length < 5) {
      setSelected([...selected, movie]);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleContinue = () => {
    setFavourites(selected);
    navigate('home');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-black"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movies...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden px-6 py-12"
    >
      {/* Animated Cinematic Background */}
      <div className="absolute inset-0 bg-black">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Build Your Taste Profile
          </h2>
          <p className="text-gray-300 text-lg">Search and select 5 movies you love</p>
          <div className="mt-6 flex justify-center gap-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`w-16 h-2 rounded-full transition-all duration-500 ${
                  i < selected.length ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="🔍 Search for movies... (e.g., Inception, Interstellar)"
              className="w-full px-6 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl focus:border-purple-500 focus:outline-none transition-all text-white text-lg placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mt-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              {searchResults.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                  onClick={() => toggleMovie(movie)}
                  className="flex items-center gap-4 p-4 cursor-pointer border-b border-white/5 last:border-b-0"
                >
                  <img src={movie.poster} alt={movie.title} className="w-12 h-18 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-gray-400">{movie.year} • {movie.genres.join(', ')}</p>
                  </div>
                  {selected.find(m => m.id === movie.id) && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">✓</div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Selected Movies */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-300">Your Selections</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {selected.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: i * 0.1 }}
                  className="relative group"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-32 h-48 object-cover rounded-xl ring-4 ring-purple-500 shadow-2xl shadow-purple-500/50"
                  />
                  <button
                    onClick={() => setSelected(selected.filter(m => m.id !== movie.id))}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 rounded-b-xl">
                    <p className="text-xs font-semibold text-center">{movie.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selected.length === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="px-16 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              ✨ Discover Your Personalized Feed
            </motion.button>
          </motion.div>
        )}

        {selected.length === 0 && !searchQuery && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-gray-400"
          >
            <p className="text-lg mb-4">Popular choices to get started:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {allMovies.slice(0, 6).map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => toggleMovie(movie)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm transition-all"
                >
                  {movie.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Home Page
const HomePage = ({ navigate, user, watchedMovies, setWatchedMovies, favouriteMovies }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all movies first
        const allMoviesResponse = await fetch(`${API_BASE}/recommend/all`);
        const movieTitles = await allMoviesResponse.json();
        
        // Convert titles to movie objects
        const movieObjects = movieTitles.map((title, index) => ({
          id: index + 1,
          title: title,
          year: 2020,
          genres: ['Drama'],
          rating: 8.0,
          poster: `https://picsum.photos/300/450?random=${index + 1000}`
        }));
        setAllMovies(movieObjects);

        // Fetch recommendations if user has favorites
        if (favouriteMovies.length > 0) {
          const firstFav = favouriteMovies[0].title;
          const recResponse = await fetch(`${API_BASE}/recommend/${encodeURIComponent(firstFav)}`);
          const recData = await recResponse.json();
          setRecommendations(recData.recommendations || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setAllMovies([]);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [favouriteMovies]);

  // Create recommendation-based movies from API (limit to 50 as requested)
  const recommendationMovies = recommendations.slice(0, 50).map((title, index) => ({
    id: 20000 + index,
    title: title,
    year: 2021,
    genres: ['Drama', 'Action'],
    rating: 8.2,
    poster: `https://picsum.photos/300/450?random=${20000 + index}`
  }));

  const sections = [
    { 
      title: `Recommended for You`, 
      movies: recommendationMovies
    },
    { 
      title: 'All Movies', 
      movies: allMovies.slice(0, 20) 
    }
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-black"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your personalized feed...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Animated Cinematic Background */}
      <div className="fixed inset-0 bg-black -z-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent cursor-pointer"
          >
            CineMind
          </motion.h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-gray-400">
              {watchedMovies.length} watched
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('profile')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full hover:bg-purple-600/30 transition-all"
            >
              Profile
            </motion.button>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 px-6">
        {sections.map((section, sectionIndex) => (
          <motion.div 
            key={sectionIndex} 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-white/90 px-2">{section.title}</h2>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 pb-4 min-w-max">
                {section.movies.map((movie, movieIndex) => (
                  <motion.div
                    key={`${movie.id}-${movieIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: sectionIndex * 0.1 + movieIndex * 0.05 }}
                    className="flex-shrink-0"
                  >
                    <MovieCard
                      movie={movie}
                      watched={watchedMovies.includes(movie.id)}
                      onToggleWatched={() => {
                        if (watchedMovies.includes(movie.id)) {
                          setWatchedMovies(watchedMovies.filter(id => id !== movie.id));
                        } else {
                          setWatchedMovies([...watchedMovies, movie.id]);
                        }
                      }}
                      sourceMovie={favouriteMovies[0]?.title}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Movie Card Component
const MovieCard = ({ movie, watched, onToggleWatched, sourceMovie }) => {
  const [showWhy, setShowWhy] = useState(false);
  const isCollaborative = Math.random() > 0.5;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 w-64"
    >
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-96 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={onToggleWatched}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              watched ? 'bg-green-500' : 'bg-black/50 hover:bg-black/70'
            }`}
          >
            {watched ? '✓' : '○'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
          <span>{movie.year}</span>
          <span>•</span>
          <span>⭐ {movie.rating}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
              {genre}
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showWhy ? '▼' : '▶'} Why recommended?
        </button>

        <AnimatePresence>
          {showWhy && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 text-sm text-gray-400 overflow-hidden"
            >
              {isCollaborative
                ? `Users who liked ${sourceMovie || 'your favorites'} also loved this`
                : `Shares ${movie.genres[0]} genre with ${sourceMovie || 'your picks'}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Profile Page
const ProfilePage = ({ navigate, user, watchedMovies, favouriteMovies }) => {
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const response = await fetch(`${API_BASE}/recommend/all`);
        const movieTitles = await response.json();
        const movieObjects = movieTitles.map((title, index) => ({
          id: index + 1,
          title: title,
          year: 2020,
          genres: ['Drama'],
          rating: 8.0,
          poster: `https://picsum.photos/300/450?random=${index + 2000}`
        }));
        setAllMovies(movieObjects);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setAllMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  const allGenres = favouriteMovies.flatMap(m => m.genres);
  const genreCounts = allGenres.reduce((acc, g) => {
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});
  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-black"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black px-6 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('home')}
          className="mb-8 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
        >
          ← Back to Home
        </button>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h2 className="text-3xl font-bold">{user?.name || 'Movie Lover'}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-3xl font-bold text-purple-400">{watchedMovies.length}</div>
              <div className="text-gray-400">Movies Watched</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-3xl font-bold text-blue-400">{favouriteMovies.length}</div>
              <div className="text-gray-400">Favorites</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-3xl font-bold text-pink-400">{topGenres.length}</div>
              <div className="text-gray-400">Top Genres</div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Your Taste Profile</h3>
          <div className="space-y-4">
            {topGenres.map(([genre, count]) => (
              <div key={genre}>
                <div className="flex justify-between mb-2">
                  <span>{genre}</span>
                  <span className="text-purple-400">{count} movies</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / favouriteMovies.length) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Your Favorite Movies</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {favouriteMovies.map((movie) => (
              <div key={movie.id} className="relative rounded-lg overflow-hidden group">
                <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-sm text-center px-2">{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-4">Watched Movies</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {allMovies.filter(m => watchedMovies.includes(m.id)).map((movie) => (
              <div key={movie.id} className="relative rounded-lg overflow-hidden group">
                <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-sm text-center px-2">{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
          {watchedMovies.length === 0 && (
            <p className="text-gray-400 text-center py-8">No movies watched yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CineMindApp;