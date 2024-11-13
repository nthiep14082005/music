/**
    1. render songs 
    2. scroll top 
    3. Play / pause / seek 
    4. CD rotate 
    5. next / prev
    6. random
    7. next / repeat when ended
    8. active song
    9. scroll active song into view
    10. play song when click
 */
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    
    const player = $('.player')
    const cd = $('.cd')
    const heading = $('header h2')
    const cdThumb = $('.cd-thumb')
    const audio = $('#audio')
    const playBtn = $('.btn-toggle-play')
    const progress = $('#progress')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')
    
    const playlist = $('playlist');
    
    const app = {
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        currentIndex: 5,
        songs: [
            {
                name: 'Dark fantasy',
                singer: 'N/A',
                path: './music/dark fantasy.mp3',
                image: './image/dark-fantasy-ai-not-your-typical-dark-fantasy-ai-v0-6ks8iepbe9dc1.webp'
            },
            {
                name: 'Lạc Trôi',
                singer: 'Sơn Tùng MTP',
                path: './music/y2meta.com - Lạc Trôi (320 kbps).mp3',
                image: './image/Lac_troi_single_sontungmtp.jpg'
            },
            {
                name: 'Đợi',
                singer: '52Hz',
                path: './music/y2meta.com - ĐỢI - 52Hz (prod. RIO) _ Official Lyric Video (320 kbps).mp3',
                image: './image/đợi.jpg'
            },
            {
                name: 'Golden hour',
                singer: 'JVKE',
                path: './music/y2meta.com - JVKE - golden hour (official music video) (320 kbps).mp3',
                image: './image/Kollen-Golden-Hour-2020.jpg'
            },
            {
                name: 'Color your night',
                singer: 'Cover',
                path: './music/y2meta.com - Persona 3 Reload - Color Your Night (320 kbps).mp3',
                image: './image/artworks-Uyz3OgqhXuzzYnWI-Bg9iBg-t500x500.jpg'
            },
            {
                name: 'Khuôn mặt đáng thương',
                singer: 'Sơn Tùng',
                path: './music/Khuôn Mặt Đáng Thương ( 80s Remix ) - Music Relax Chill (youtube).mp3',
                image: './image/khuon mặt đáng thương.jpg'
            },
            {
                name: 'Nắng ấm xa dần',
                singer: 'Sơn Tùng',
                path: './music/Nắng Ấm Xa Dần _ Sơn Tùng M-TP _ Remix By BING _ 80s _ - BING (youtube).mp3',
                image: './image/nắng ấm xa dần.jpg'
            },
            {
                name: 'Chúng ta của tương lai',
                singer: 'Sơn Tùng',
                path: './music/EXTEND VERSION _ Chung ta cua tuong lai 1984 - Son Tung MTP (80s Remix) - hoangkiet (youtube).mp3',
                image: './image/artworks-gY1m51UnUiCHbnmd-DGh6Qg-t500x500.jpg'
            },
            {
                name: 'Hop on da show',
                singer: 'low G, tlinh',
                path: './music/HOP ON DA SHOW (Bolero Version) - Giọng ca để đời LowG & Tlinh - Nhạc Việt Nam nhưng ở 1 diễn biến khác (youtube).mp3',
                image: './image/hop on da show.jpg'
            },
            {
                name: 'Chúng ta không thuộc về nhau',
                singer: 'Sơn Tùng',
                path: './music/chungtakothuocvenhau.mp3',
                image: './image/chúng ta ko thuộc về nhau.jpg'
            }
        ],
        render: function() {
            const htmls = this.songs.map((song,index) => /* function(song) */ { // this ở đây là các phần tử bên trong app mà .songs tức là this ở đây là app.songs
                return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" id="0">
                        <div class="thumb" style="background-image: url('${song.image}')"></div>
                            <div class="body">
                                <h3 class="title">${song.name}
                                    <p class="author">${song.singer}</p>
                                </h3>
                            </div>
                        <div class="fa-solid fa-ellipsis icon-dot"></div>
                    </div>
                `;
            })
            $('.playlist').innerHTML = htmls.join('\n'); // gọi vào class playlist và innerHTML vào và sử dụng tham số chứa các giá trị của bài hát là htmls trỏ tới phương thức join('') để chuyênr thành chuỗi
        },
        defineProperties: function(){ // có 2 cách để sử dụng getter đó là sử dụng Object.defineProperty hoặc sử dụng class
            Object.defineProperty(this /* this ở đây hay còn là cái defineProperties */, 'currentSong',{ // defineProperty là hàm tự định nghĩa Object còn get: ở đây là 1 hàm có sẵn trong js đó là nó sẽ lấy ra giá trị của thuộc tính mà ko cần gọi hàm
                get: function(){
                    return this.songs[this.currentIndex]; // this đầu tiên là những phần tử bên trong app,,.. this thứ 2 ở đây lại là những thứ bên trong songs 
                }
            })
        },
        // syntax defineProperty(object cần define, 'tên key', 'giá trị của key đó')
        handleEvents: function(){
            const _this = this; // this ở đây là giá trị trong biến app và gán _this = các phần tử bên trong biến app
            const cdWidth = cd.offsetWidth; // xem lại offsetWidth 
            
            // xử lý giao diện kéo trình duyệt
            document.onscroll = function(){
                // console.log(window.scrollY)  // window.scrollY là window là đại diện cho biến cửa sổ trình duyệt còn scrollY là kéo theo chiều dọc
                const scrollEvent = window.scrollY || document.documentElement.scrollTop;
                const newcdWidth = cdWidth - scrollEvent;
                cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0 + 'px';
                cd.style.opacity = newcdWidth / cdWidth;
            }
    
            // xử lý khi click play
            playBtn.onclick = function(){
                if(_this.isPlaying == true){ // tức là nếu đang chạy thì ..... hoặc để là app.isPlaying == true
                    // isPlaying = false; ??? true hay false
                    audio.pause() // phương thức dừng nhạc thẻ audio có sẵn
                    
                }else{
                    audio.play() // phương thức phát nhạc thẻ audio có sẵn
                }
            }
            // khi nhạc đang được play 
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play()
            }
            // khi nhạc đang được pause
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause()
            }
    
            // xử lý thanh thời gian chạy theo tiến độ bài hát thay đổi
            audio.ontimeupdate = function(){ // method ontimeupdate có thể theo dõi thời gian phát của audio 
                if(audio.duration){ // -> kiểm tra xem có đang ở trong thời lượng bài hát hay ko 
                    const currentProgress =  (audio.currentTime / audio.duration) * 100; // hoặc để là Math.floor((audio.currentTime / audio.duration) * 100); , curretnTime là time hiện tại và chia cho tổng thời lượng bài hát
                    progress.value = currentProgress;  // -> target chỉ thường được sử dụng trong các DOM event còn ở đây là tham chiếu thẳng vào giá trị value ban đầu của progress
        
                }
                // console.log((audio.currentTime / audio.duration) * 100) // -> property : curentTime của ontimeupdate của audio trên w3school , còn property: duration là tổng thời lượng của bài hát (theo second) ,curretnTime là time hiện tại của tiến trình bài hát
                // -> khi ta lấy số dây hiện tại của bài hát chia cho tổng thời lượng của bài hát nhân 100% thì ra được số phần trăm tiến độ của bài hát
            }
    
            // xử lý khi tua nhạc
            progress.onchange = function(e){
                // console.log((audio.duration * e.target.value) / 100); // -> target để lấy ra value của progress hoặc thay là progress.target.value
                const seekTime = (audio.duration * e.target.value) / 100;
                audio.currentTime = seekTime;
            }
            // xử lý cd quay và dừng
            const cdThumbAnimate = cdThumb.animate ([ // phương thức animate nhận 2 đối số , t1 là mảng , và thứ 2 là 
                { transform: 'rotate(360deg)'}
            ],{
                duration: 10, // 10 second
                iterations: Infinity
            })
            cdThumbAnimate.pause()
    
            // xử lý nextSong
            nextBtn.onclick = function(){
                if(_this.isRandom){
                    _this.playRandomSong();
                    audio.play();
                    _this.render();
                    _this.scrollToActiveSong();
                }
                else{
                    app.nextSong(); // dùng app hoặc this_ cũng được
                    audio.play();
                    _this.render();
                    _this.scrollToActiveSong();
                }
            }
            // xử lý prevSong
            prevBtn.onclick = function(){
                if(_this.isRandom){
                    _this.playRandomSong();
                    audio.play();
                    _this.render();
                    _this.scrollToActiveSong();
                }
                else{
                    _this.prevSong(); // dùng app hoặc this_ cũng được
                    audio.play();
                    _this.render();
                    _this.scrollToActiveSong();
                }
            }
            // xử lý khi nhấm space để dừng
            // playBtn.onkeyup = function (e){
            //     console.log(e.target.value)
            // }
            // xử lý khi randomsong ta nên xử lý vào trong prev hoặc next Song ở trên 
            randomBtn.onclick = function(e){
                // if(_this.isRandom){
                //     _this.isRandom = false;
                //     randomBtn.classList.remove('active');
                // }else{
                //     _this.isRandom = true;
                //     randomBtn.classList.add('active');
                // }
    
                // cach 2
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active', _this.isRandom); 
                // đọc về toggle()
                // ban đầu isRandom = false thì ta sẽ đặt biến _this.isRandom = !false -> true
                // sau đó gọi method toggle('active', _this.isRandom) -> trả về kiểu boolean nếu _this.isRandom là true thì tự động add 'active' còn nếu false thì remove 'active'
            }
    
            // repeat khi ended bài hát 
            repeatBtn.onclick = function(e){
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle('active',_this.isRepeat);
            }
    
            // xử lý next song khi audio ended
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play();
                }else{
                    nextBtn.click(); // nó tương tự như khi ta sử dụng onclick nhưng có điều là click tự động
                }
            }
        },
        scrollToActiveSong: function(){
            
        },
        loadCurrentSong: function(){ // vậy tức là this ở đây là lấy về danh sách những giá trị bên trong currentSong, cụ thể ở đây this chính là app
            // console.log(heading,cdThumb,audio)
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${app.currentSong.image}')` // hay còn viết là url('${this.currentSong.image}')
            audio.src = this.currentSong.path
        },
        
        nextSong: function(){
            this.currentIndex++
            if(this.currentIndex >= this.songs.length){
                this.currentIndex = 0
            }
            this.loadCurrentSong();
        },
        prevSong: function(){
            this.currentIndex--
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong();
        },
        playRandomSong: function(){
            let newIndex
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            }while(newIndex === this.currentIndex)
            this.currentIndex = newIndex
            this.loadCurrentSong();
            
        },
    
        start: function (){
            // định nghĩa các thuộc tính cho object
            this.defineProperties();
            // lắng nghe và xử lý các sự kiện , (DOM event)
            this.handleEvents();
            // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
            this.loadCurrentSong();
    
            // render playlist
            this.render();
        }
    }
    app.start();
    