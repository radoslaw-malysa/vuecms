<template>
  <v-container class="pt-4 pb-10" v-scroll="onScroll">
    
    <div class="h-56">
      <div id="finder" class="find-container" v-bind:class="{ sticked: finderSticked }">
        <div class="container">
          <v-toolbar
            flat
            outlined
            rounded
            :height="finderHeight"
            class="rounded-pill find-toolbar nob-dark"
          >
            <v-text-field
              label="Szukaj w tytule"
              solo
              flat
              hide-details
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-divider
              class="mx-4"
              vertical
            ></v-divider>
            <v-select
              :items="items"
              label="Kategoria"
              solo
              flat
              hide-details
            ></v-select>
            <v-divider
              class="mx-4"
              vertical
            ></v-divider>
            <v-combobox
              v-model="selectTag"
              :items="items"
              label="Tag"
              solo
              flat
              hide-details
            ></v-combobox>
            <v-divider
              class="ml-4"
              vertical
            ></v-divider>
            <v-btn icon class="ml-1" color="primary">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
        </div>
      </div>
    </div>

    <v-toolbar
      flat
      height="56px"
      class="filter-toolbar nobg-dark my-3 mb-12"
    >
      <v-select
        :items="items"
        placeholder="Status"
        dense
        outlined
        rounded
        hide-details
        class="mr-2 state-select"
      ></v-select>

      <v-select
        :items="items"
        placeholder="Redaktor"
        dense
        outlined
        rounded
        hide-details
        class="mr-4 user-select"
      ></v-select>

      <v-checkbox
        v-model="ord"
        label="Sponsorowane"
        hide-details
      ></v-checkbox>
      <v-spacer></v-spacer>
     </v-toolbar>

    <v-card
      outlined
      class="nobg-dark"
    >
      <v-data-table
        :headers="headers"
        :items="desserts"
        :items-per-page="20"
        class="nobg-dark"
      ></v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  

  export default {
    name: 'Contents',
    data: () => ({
      items: ['Kategoria', 'Foo', 'Bar', 'Fizz', 'Buzz'],
      selectTag: null,
      ord: false,

      headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
        ],
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ],
        finderTop: 0,
        finderSticked: false,
    }),
    computed: {
      finderHeight() {
        return (this.finderSticked) ? 64 : 56;
      }
    },
    mounted() {
      this.stickFinderInit();
    },
    methods: {
      stickFinderInit() {
        const finder = document.getElementById("finder");
        var rect = finder.getBoundingClientRect(),
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.finderTop = rect.top + scrollTop;
      },
      onScroll () {
        let scrollT = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollT > this.finderTop) {
          this.finderSticked = true;
        } else {
          this.finderSticked = false;
        }
      },
    }
  }
</script>
