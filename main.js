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

const playlist = $('playlist');

const app = {
    isPlaying: false,
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
            path: './music/Chúng Ta Không Thuộc Về Nhau _ Sơn Tùng M-TP _  80s Remix  _ - BING (youtube).mp3',
            image: './image/chúng ta ko thuộc về nhau.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map(song => /* function(song) */ { // this ở đây là các phần tử bên trong app mà .songs tức là this ở đây là app.songs
            return `
                <div class="song active" id="0">
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
                return this.songs[this.currentIndex]; // this đầu tiên là những phần tử bên tỏng app,,.. this thứ 2 ở đây lại là những thứ bên trong songs 
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

        }
        // khi nhạc đang được pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');

        }

        // xử lý thanh thời gian chạy theo tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){ // -> kiểm tra xem có đang ở trong thời lượng bài hát hay ko 
                const currentProgress =  (audio.currentTime / audio.duration) * 100; // hoặc để là Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = currentProgress;  // -> target chỉ thường được sử dụng trong các DOM event còn ở đây là tham chiếu thẳng vào giá trị value ban đầu của progress
    
            }
            // console.log((audio.currentTime / audio.duration) * 100) // -> property : curentTime của ontimeupdate của audio trên w3school , còn property: duration là tổng thời lượng của bài hát (theo second) 
            // -> khi ta lấy số dây hiện tại của bài hát chia cho tổng thời lượng của bài hát nhân 100% thì ra được số phần trăm tiến độ của bài hát
        }

        // xử lý khi tua nhạc
        progress.onchange = function(e){
            // console.log((audio.duration * e.target.value) / 100); // -> target để lấy ra value của progress hoặc thay là progress.target.value
            const seekTime = (audio.duration * e.target.value) / 100;
            audio.currentTime = seekTime;
        }
    },
    loadCurrentSong: function(){ // vậy tức là this ở đây là lấy về danh sách những giá trị bên trong currentSong
        // console.log(heading,cdThumb,audio)
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${app.currentSong.image}')` // hay còn viết là url('${this.currentSong.image}')
        audio.src = this.currentSong.path
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
