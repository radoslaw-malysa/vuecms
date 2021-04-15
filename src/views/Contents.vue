<template>
  <v-container class="py-4">
    <v-toolbar
      flat
      outlined
      rounded
      height="56px"
      class="rounded-pill find-toolbar"
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
      <v-btn icon class="ml-1">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <v-toolbar
      flat
      height="56px"
      class="filter-toolbar my-3 mb-12"
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
    >
      <v-data-table
        :headers="headers"
        :items="desserts"
        :items-per-page="5"
        class=""
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
    }),
  }
</script>
