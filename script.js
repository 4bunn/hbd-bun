document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    const miffyImage = document.getElementById("miffyImage");
    const memoryLaneSection = document.querySelector('.memory-lane-section');
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
    let audio = new Audio('22 long.mp3');

    // Show miffy image after all candles are blown out
    function showMiffyImage() {
      setTimeout(function() {
        miffyImage.classList.add('show');
      }, 1000); // Show after 1 second delay
    }

    // Show Memory Lane when miffy image is clicked
    function showMemoryLane() {
      memoryLaneSection.classList.remove('hidden');
    }

    // Close Memory Lane
    window.closeMemoryLane = function() {
      memoryLaneSection.classList.add('hidden');
    }

    // Add click event to miffy image
    miffyImage.addEventListener('click', showMemoryLane);

    function createImage(src, id, style) {
        const img = document.createElement('img');
        img.src = src;
        img.id = id;
        img.style.cssText = `position: absolute; ${style} opacity: 0; transition: opacity 1s ease-in-out;`;
        document.body.appendChild(img);
        return img;
    }

    function updateCandleCount() {
        const activeCandles = candles.filter(
            (candle) => !candle.classList.contains("out")
        ).length;
        candleCountDisplay.textContent = activeCandles;
    }

    function addCandle(left, top) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = left + "px";
        candle.style.top = top + "px";

        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);

        cake.appendChild(candle);
        candles.push(candle);
        updateCandleCount();
    }

    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;

        return average > 50; // ito baguhin
    }

    function blowOutCandles() {
        let blownOut = 0;

        // Only check for blowing if there are candles and at least one is not blown out
        if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
            if (isBlowing()) {
                candles.forEach((candle) => {
                    if (!candle.classList.contains("out") && Math.random() > 0.5) {
                        candle.classList.add("out");
                        blownOut++;
                    }
                });
            }

            if (blownOut > 0) {
                updateCandleCount();
            }

            // If all candles are blown out, trigger confetti and show miffy image
            if (candles.every((candle) => candle.classList.contains("out"))) {
                setTimeout(function() {
                    triggerConfetti();
                    setTimeout(function() {
                      endlessConfetti();
                      showMiffyImage(); // Show miffy image instead of memory lane
                    }, 500);
                }, 200);
                audio.play();
            }
        }
    }

    // Restore candle adding on cake click
    cake.addEventListener("click", function (event) {
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
    });

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function (stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                setInterval(blowOutCandles, 200);
            })
            .catch(function (err) {
                console.log("Unable to access microphone: " + err);
            });
    } else {
        console.log("getUserMedia not supported on your browser!");
    }
  });

  function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
  }

  function endlessConfetti() {
    setInterval(function() {
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0 }
        });
    }, 1000);
  }

// Lightbox functionality for memory lane images
function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.memory-item img').forEach(function(img) {
    img.addEventListener('click', function() {
      document.getElementById('lightbox-img').src = this.src;
      document.getElementById('lightbox').style.display = 'flex';
    });
  });
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === this) closeLightbox();
    });
  }
});
  