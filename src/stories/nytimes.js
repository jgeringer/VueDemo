//moc data...

// results: [
//     {
//         title: 'the very first post',
//         abstract: 'lorem ipsum a'
//     },
//     {
//         title: 'the very second post',
//         abstract: 'lorem ipsum b'
//     },
//     {
//         title: 'the very third post',
//         abstract: 'lorem ipsum c'
//     },
//     {
//         title: 'the very forth post',
//         abstract: 'lorem ipsum d'
//     }
// ]

const NYTBaseUrl = "https://api.nytimes.com/svc/topstories/v2/";
const ApiKey = "ce214912e0424d1daab90039a9fe12de";

function buildUrl (url) {
  return NYTBaseUrl + url + ".json?api-key=" + ApiKey
};

// 1. Define route components.
// These can be imported from other files
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: 'foo', component: Foo },
  { path: 'bar', component: Bar }
]


// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
// https://router.vuejs.org/en/essentials/history-mode.html
const router = new VueRouter({
    mode: 'history',
    routes
    //routes: [{ path: '/', component: home },       { path: '/contact', component: contact }]
  })
  



//component version...
//Vue.component(tagName, options)

Vue.component('news-list', {
    props: ['results'],
    template: `
      <section>
        <div class="row" v-for="posts in processedPosts">
          <div class="columns large-3 medium-6" v-for="post in posts">
            <div class="card">
            <div class="card-divider">
            {{ post.title }}
            </div>
            <a :href="post.url" target="_blank"><img :src="post.image_url"></a>
            <div class="card-section">
              <p>{{ post.abstract }}</p>
            </div>
          </div>
          </div>
        </div>
    </section>
    `,
    computed: {
      processedPosts() {
        let posts = this.results;
  
        // Add image_url attribute
        posts.map(post => {
          let imgObj = post.multimedia.find(media => media.format === "superJumbo");
          post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?text=N/A";
        });
  
        // Put Array into Chunks
        let i, j, chunkedArray = [], chunk = 4;
        for (i=0, j=0; i < posts.length; i += chunk, j++) {
          chunkedArray[j] = posts.slice(i,i+chunk);
        }
        return chunkedArray;
      }
    }
});



const SECTIONS = "home, arts, automobiles, books, business, fashion, food, health, insider, magazine, movies, national, nyregion, obituaries, opinion, politics, realestate, science, sports, sundayreview, technology, theater, tmagazine, travel, upshot, world"; // From NYTimes
  

const vm = new Vue({
    router,
    el: '#nytimes',
    data: {
      results: [],
      sections: SECTIONS.split(', '), //create an array of the selections
      section: 'home',  //set the default section to 'home'
    },
    mounted () {
      //this.getPosts('home');
      this.getPosts(this.section);
    },
    methods: {
      getPosts(section) {
        let url = buildUrl(section);
        axios.get(url).then((response) => {
          this.results = response.data.results;
        }).catch( error => { console.log(error); });
      }
    }
  });
  


// not a component version...

// const vm = new Vue({
//   el: '#nytimes',
//   data: {
//     results: []
//   },
//   mounted () {
//     this.getPosts('home');
//   },
//   methods: {
//     getPosts(section) {
//       let url = buildUrl(section);
//       axios.get(url).then((response) => {
//         this.results = response.data.results;
//       }).catch( error => { console.log(error); });
//     }
//   },
//   computed: {
//     processedPosts() {
//       let posts = this.results;

//       // Add image_url attribute
//       posts.map(post => {
//         let imgObj = post.multimedia.find(media => media.format === "superJumbo");
//         post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?text=N/A";
//       });

//       // Put Array into Chunks
//       let i, j, chunkedArray = [], chunk = 4;
//       for (i=0, j=0; i < posts.length; i += chunk, j++) {
//         chunkedArray[j] = posts.slice(i,i+chunk);
//       }
//       return chunkedArray;
//     }
//   }
// });
