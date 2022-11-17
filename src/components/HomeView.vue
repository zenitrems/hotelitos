   <template>
      <v-container fluid fill-height>
         <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6">
               <v-autocomplete
               v-model="searched"
               :items="items"
               :loading="isLoading"
               :search-input.sync="search"
               no-filter
               item-text="name"
               item-value="name"
               label="Busca un Hotel"
               return-object
               cache-items
               clearable
               dark
               >
            </v-autocomplete>
         </v-col>  
      </v-row>
   </v-container>
</template>
<script>
   import axios from "axios";
   export default {
     data() {
       return {
         isLoading: false,
         items: [],
         searched: [],
         search: null,
         hotels: [],
         show: false,
      };
   },
   watch: {
    search(val) {
   // Items have already been loaded
      if (!val) {
        return;
     }
     this.isLoading = true;
 // Lazily load input items
     this.searchDebounced(val);
  },
},
methods: {
 //debounce search query to avoid spamming the server
 searchDebounced() {
 // cancel pending call
   clearTimeout(this._timerId);
   this.isLoading = true;
   //delay new call
   this._timerId = setTimeout(() => {
     axios
     .get("/search", { params: { keyword: this.search } })
     .then((res) => {
       this.items = res.data.data;
        //console.log(this.items);
       this.isLoading = false;
    })
     .catch((err) => {
       console.log(err);
       this.isLoading = false;
    });
  }, 850);
},
},
};
</script>