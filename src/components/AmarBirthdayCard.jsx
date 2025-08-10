import { useState, useEffect } from 'react';
import { Heart, Calendar, Star, Globe, Moon, Wheat, Sprout, Sun, Droplets, TrendingUp, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AmarBirthdayCardPrintable() {
  const [stats, setStats] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  
  useEffect(() => {
    // Calculate stats for Amar's birthdate: August 10, 1995
    const birthDate = new Date('1995-08-10');
    const today = new Date();
    
    // Calculate weeks lived
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLived = Math.floor((today - birthDate) / msInWeek);
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Calculate days lived
    const msInDay = 1000 * 60 * 60 * 24;
    const daysLived = Math.floor((today - birthDate) / msInDay);
    
    // Calculate years in breeding (assuming started at 29)
    const breedingYears = Math.max(0, age - 29);
    
    // Estimate sugar beet generations bred (2 per year typically)
    const beetGenerations = breedingYears * 2;
    
    // Calculate heartbeats (average 70 bpm)
    const heartbeats = Math.floor(daysLived * 24 * 60 * 70);
    
    // Calculate seasons experienced
    const seasons = Math.floor(daysLived / 91.25);
    
    // Calculate growing seasons witnessed (relevant to agriculture)
    const growingSeasons = age;
    
    // Calculate lunar cycles
    const lunarCycles = Math.round(daysLived / 29.53);
    
    // Earth travels around sun
    const earthDistance = Math.round(daysLived * 1.6 * 1000000);
    
    // Agricultural calculations
    const seedsHandled = breedingYears * 50000; // Estimate seeds handled per year
    const plotsManaged = breedingYears * 100; // Research plots managed
    
    setStats({
      age,
      weeksLived,
      daysLived,
      heartbeats,
      seasons,
      growingSeasons,
      lunarCycles,
      earthDistance,
      birthYear: 1995,
      breedingYears,
      beetGenerations,
      seedsHandled,
      plotsManaged
    });
    
    // Trigger animation after component mounts
    setTimeout(() => setShowAnimation(true), 500);
  }, []);

  const getFormattedNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const exportToPDF = async () => {
    setIsPrinting(true);
    try {
      const element = document.getElementById('printable-card');
      
      // Set element to full width before capture
      const originalWidth = element.style.width;
      element.style.width = '1920px'; // Full HD width for better quality
      
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 1920,
        windowHeight: element.scrollHeight,
        logging: false
      });
      
      // Restore original width
      element.style.width = originalWidth;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to use full page width
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Use full width with small margins (5mm on each side)
      const margin = 5;
      const contentWidth = pdfWidth - (2 * margin);
      const ratio = contentWidth / imgWidth;
      const contentHeight = imgHeight * ratio;
      
      // Calculate how many pages we need
      const pageHeight = pdfHeight - (2 * margin);
      const totalPages = Math.ceil(contentHeight / pageHeight);
      
      // Add content to PDF pages
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        const yPosition = -(page * pageHeight);
        pdf.addImage(
          imgData, 
          'PNG', 
          margin, 
          margin + yPosition, 
          contentWidth, 
          contentHeight
        );
      }

      pdf.save(`Amar-Birthday-Card-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const renderCompactWeekGrid = () => {
    if (!stats) return null;
    
    const totalWeeks = 3900; // 75 years * 52 weeks
    const rows = [];
    const weeksPerRow = 52;
    const rowsToShow = 75; // Show full 75 years
    
    for (let row = 0; row < rowsToShow; row++) {
      const weekCells = [];
      for (let col = 0; col < weeksPerRow; col++) {
        const weekNumber = row * weeksPerRow + col;
        const isPast = weekNumber < stats.weeksLived;
        const isCurrent = weekNumber === stats.weeksLived;
        
        let cellClass = "w-1 h-1 m-0.5 rounded-sm transition-all duration-300 ";
        if (isPast) {
          if (row < 5) cellClass += showAnimation ? "bg-yellow-400" : "bg-gray-200";
          else if (row < 18) cellClass += showAnimation ? "bg-green-500" : "bg-gray-200";
          else if (row < 29) cellClass += showAnimation ? "bg-blue-500" : "bg-gray-200";
          else cellClass += showAnimation ? "bg-amber-600" : "bg-gray-200";
        } else if (isCurrent) {
          cellClass += "bg-red-500 animate-pulse shadow-lg ring-2 ring-red-300";
        } else {
          cellClass += "bg-gray-400 opacity-60"; // Darker remaining weeks
        }
        
        weekCells.push(<div key={weekNumber} className={cellClass} />);
      }
      
      rows.push(
        <div key={row} className="flex justify-center">
          {weekCells}
        </div>
      );
    }
    
    return rows;
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-green-700 font-medium">Preparing your greeting card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 p-8">
      {/* Export Button Only */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={exportToPDF}
          disabled={isPrinting}
          className="bg-gradient-to-r from-green-600 to-amber-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
        >
          {isPrinting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export as PDF
            </>
          )}
        </button>
      </div>

      {/* Main Card Container */}
      <div id="printable-card" className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Portrait Image at Top */}
        <div className="relative bg-gradient-to-br from-green-100 via-emerald-50 to-amber-100 p-8 text-center">
          {/* Limited Edition Badge with Image */}
          <div className="absolute top-4 right-4 w-24 h-24">
            <img 
              src="./dr-dhiman-limited-edition.png" 
              alt="Limited Edition"
              className="w-full h-full object-contain drop-shadow-2xl transform rotate-12 hover:rotate-6 transition-transform"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="bg-gradient-to-r from-gold-500 to-amber-500 text-white px-4 py-2 rounded-full shadow-lg transform rotate-3 hidden">
              <span className="text-sm font-bold">LIMITED EDITION</span>
              <span className="text-xs block">Birthday 2025</span>
            </div>
          </div>
          <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="./portrait.png" 
              alt="Amar Singh Portrait"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-amber-500 items-center justify-center text-white hidden">
              <div className="text-center">
                <Wheat className="w-24 h-24 mx-auto mb-4" />
                <p className="text-2xl font-bold">Amar Singh</p>
                <p className="text-lg">Dhiman</p>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mt-6 text-gray-800">Amar Singh Dhiman</h2>
          <p className="text-xl text-gray-600 mt-2">Sugar Beet Breeding Specialist</p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">🌱 Plant Breeder</span>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">🌾 Agriculture Expert</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">🔬 Researcher</span>
          </div>
        </div>

        {/* Header Section - Front of Card */}
        <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-amber-500 p-12 print:p-6 text-white text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10">
              <Wheat className="w-32 h-32 rotate-12" />
            </div>
            <div className="absolute bottom-10 right-10">
              <Sprout className="w-32 h-32 -rotate-12" />
            </div>
            <div className="absolute top-1/2 left-1/4">
              <Star className="w-20 h-20" />
            </div>
            <div className="absolute top-1/2 right-1/4">
              <Heart className="w-20 h-20" fill="currentColor" />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-6xl print:text-3xl font-bold mb-4 print:mb-2">Happy Birthday!</h1>
              <div className="flex justify-center items-center space-x-4 text-2xl">
                <span>🎉</span>
                <span>August 10th</span>
                <span>•</span>
                <span>Turning {stats.age}</span>
                <span>🎂</span>
              </div>
              <p className="text-xl mt-4 font-light italic">Sugar Beet Breeder Extraordinaire</p>
            </div>
          </div>
        </div>

        {/* Inside Pages Content */}
        <div className="p-8 space-y-6 print:p-4 print:space-y-4">
          {/* Life Journey Visualization */}
          <div className="border-2 border-green-200 rounded-2xl p-6 bg-gradient-to-br from-green-50 to-amber-50 print:p-4">
            <h2 className="text-3xl print:text-xl font-bold text-center mb-6 print:mb-3 text-gray-800 flex items-center justify-center">
              <Star className="w-8 h-8 mr-3 text-yellow-500" />
              Your Life Journey in Weeks
              <Star className="w-8 h-8 ml-3 text-yellow-500" />
            </h2>
            <div className="mb-6">
              {renderCompactWeekGrid()}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-gray-600">Childhood (0-5)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Youth (5-18)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Education (18-29)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-600 rounded-full mr-2"></div>
                <span className="text-gray-600">Professional (29+)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-gray-600">Future</span>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-4 italic">
              Each square represents one week of your incredible {stats.weeksLived} week journey so far!
            </p>
          </div>


          {/* Life Statistics Grid */}
          <div className="grid grid-cols-2 gap-8 print:gap-4">
            {/* Life Milestones */}
            <div className="border-2 border-emerald-200 rounded-2xl p-6 print:p-3 bg-gradient-to-br from-emerald-50 to-green-50">
              <h3 className="text-2xl font-bold mb-4 text-emerald-800 flex items-center">
                <Calendar className="w-6 h-6 mr-2" />
                Life Milestones
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Weeks lived</span>
                  <span className="text-xl font-bold text-emerald-700">{getFormattedNumber(stats.weeksLived)}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Days experienced</span>
                  <span className="text-xl font-bold text-emerald-700">{getFormattedNumber(stats.daysLived)}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Growing seasons</span>
                  <span className="text-xl font-bold text-emerald-700">{stats.growingSeasons}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Life completion</span>
                  <span className="text-xl font-bold text-emerald-700">{Math.round((stats.weeksLived / 3900) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Professional Legacy */}
            <div className="border-2 border-amber-200 rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-orange-50">
              <h3 className="text-2xl font-bold mb-4 text-amber-800 flex items-center">
                <Wheat className="w-6 h-6 mr-2" />
                Agricultural Legacy
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Years breeding</span>
                  <span className="text-xl font-bold text-amber-700">{stats.breedingYears}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Beet generations</span>
                  <span className="text-xl font-bold text-amber-700">{stats.beetGenerations}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Seeds handled</span>
                  <span className="text-xl font-bold text-amber-700">{getFormattedNumber(stats.seedsHandled)}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Research plots</span>
                  <span className="text-xl font-bold text-amber-700">{getFormattedNumber(stats.plotsManaged)}</span>
                </div>
              </div>
            </div>

            {/* Physical Journey */}
            <div className="border-2 border-red-200 rounded-2xl p-6 bg-gradient-to-br from-red-50 to-rose-50">
              <h3 className="text-2xl font-bold mb-4 text-red-800 flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                Physical Journey
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Heartbeats</span>
                  <span className="text-xl font-bold text-red-700">{getFormattedNumber(stats.heartbeats)}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Breaths taken</span>
                  <span className="text-xl font-bold text-red-700">{getFormattedNumber(Math.floor(stats.daysLived * 24 * 60 * 16))}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Steps walked</span>
                  <span className="text-xl font-bold text-red-700">{getFormattedNumber(Math.floor(stats.daysLived * 7500))}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Water (Liters)</span>
                  <span className="text-xl font-bold text-red-700">{getFormattedNumber(Math.floor(stats.daysLived * 2.5))}</span>
                </div>
              </div>
            </div>

            {/* Cosmic Perspective */}
            <div className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-2xl font-bold mb-4 text-blue-800 flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                Cosmic Journey
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Earth journey</span>
                  <span className="text-xl font-bold text-blue-700">{getFormattedNumber(stats.earthDistance)} km</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Solar orbits</span>
                  <span className="text-xl font-bold text-blue-700">{stats.age}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Lunar cycles</span>
                  <span className="text-xl font-bold text-blue-700">{getFormattedNumber(stats.lunarCycles)}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">Seasons</span>
                  <span className="text-xl font-bold text-blue-700">{getFormattedNumber(stats.seasons)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="border-2 border-purple-200 rounded-2xl p-8 bg-gradient-to-br from-purple-50 to-pink-50">
            <h3 className="text-3xl font-bold mb-6 text-center text-purple-800">Your Global Impact</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-3xl mb-2">🌾</div>
                <div className="text-2xl font-bold text-green-700">20%</div>
                <p className="text-sm text-gray-600">of world's sugar from beets</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-3xl mb-2">🌍</div>
                <div className="text-2xl font-bold text-blue-700">Global</div>
                <p className="text-sm text-gray-600">Food security impact</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-3xl mb-2">🌱</div>
                <div className="text-2xl font-bold text-amber-700">Future</div>
                <p className="text-sm text-gray-600">Sustainable agriculture</p>
              </div>
            </div>
            <p className="text-center text-gray-700 mt-6 italic text-lg">
              Your work in sugar beet breeding doesn't just improve crops—it feeds families, 
              supports sustainable farming, and shapes the future of agriculture worldwide.
            </p>
          </div>

          {/* Birthday Message - Back of Card */}
          <div className="border-4 border-gradient-to-r from-green-400 to-amber-400 rounded-2xl p-8 bg-gradient-to-br from-green-100 via-emerald-50 to-amber-100">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">A Life Well Cultivated</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                <strong>Dear Amar Singh Dhiman,</strong>
              </p>
              <p>
                In your remarkable {stats.age} years, you've witnessed {getFormattedNumber(stats.seasons)} seasons 
                of change and growth. Your heart has beaten over {getFormattedNumber(stats.heartbeats)} times, 
                each beat fueling your passion for agricultural innovation.
              </p>
              <p>
                Through {stats.breedingYears} years of dedicated breeding work, you've nurtured countless 
                sugar beet varieties, handling an estimated {getFormattedNumber(stats.seedsHandled)} seeds—each 
                one a potential breakthrough that could transform agriculture and feed the world.
              </p>
              <p>
                Your journey from childhood through your extensive education (completing at 29) shows 
                incredible dedication to mastering your craft. Now, as a professional breeder, you're 
                not just growing plants—you're cultivating a better future for humanity.
              </p>
              <p className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600 mt-6">
                Here's to many more seasons of growth, discovery, and sweet success!
              </p>
              <div className="flex justify-center space-x-4 mt-6 text-4xl">
                <span>🌱</span>
                <span>🎂</span>
                <span>🌾</span>
                <span>🎉</span>
                <span>💚</span>
              </div>
            </div>
          </div>

          {/* Fun Facts Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border-2 border-teal-200 rounded-2xl p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
              <h3 className="text-xl font-bold mb-4 text-teal-800 flex items-center">
                <Sun className="w-6 h-6 mr-2" />
                Born in 1995
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• The year Windows 95 launched</li>
                <li>• Internet Explorer was born</li>
                <li>• DVD technology was introduced</li>
                <li>• Generation X/Millennial cusp</li>
                <li>• A year of technological revolution!</li>
              </ul>
            </div>
            <div className="border-2 border-orange-200 rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
              <h3 className="text-xl font-bold mb-4 text-orange-800 flex items-center">
                <Sprout className="w-6 h-6 mr-2" />
                Agricultural Pioneer
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Sugar beets = 20% of world sugar</li>
                <li>• Each plant yields 1-2 lbs sugar</li>
                <li>• Drought-resistant crop development</li>
                <li>• Sustainable farming advocate</li>
                <li>• Future food security champion!</li>
              </ul>
            </div>
          </div>

          {/* Limited Edition Certificate */}
          <div className="border-4 border-double border-amber-400 rounded-2xl p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-2 rounded-full shadow-lg">
                <span className="text-lg font-bold">🏆 LIMITED EDITION CERTIFICATE 🏆</span>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2">This Birthday Card is One of a Kind</p>
            <p className="text-gray-600">Specially Created for</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600 my-2">AMAR SINGH DHIMAN</p>
            <p className="text-sm text-gray-500">Certificate No: #AS-2025-0810</p>
            <div className="flex justify-center gap-8 mt-4">
              <div>
                <p className="text-xs text-gray-500">Issue Date</p>
                <p className="font-semibold">August 10, 2025</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Edition</p>
                <p className="font-semibold">1 of 1</p>
              </div>
            </div>
          </div>

          {/* Full Size Limited Edition Image */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400">
              <img 
                src="./dr-dhiman-limited-edition.png" 
                alt="Limited Edition - Special Birthday Card"
                className="w-full h-auto object-contain bg-gradient-to-br from-amber-50 to-yellow-50"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-96 bg-gradient-to-br from-amber-100 to-yellow-100 items-center justify-center text-amber-800 hidden">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-3xl font-bold mb-2">Limited Edition</p>
                  <p className="text-xl">Birthday Card 2025</p>
                  <p className="text-lg mt-4">Exclusively for Amar Singh Dhiman</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t-2 border-gray-200">
            <p className="text-gray-600 mb-2">Made with ❤️ for Amar Singh Dhiman's special day</p>
            <p className="text-sm text-gray-500">August 10, 2025 • A celebration of {stats.age} amazing years</p>
            <p className="text-xs text-gray-400 mt-2">Sugar Beet Breeder • Agricultural Innovator • World Changer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
