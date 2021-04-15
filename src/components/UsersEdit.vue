<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="justify-space-between">
          <span class="headline" v-text="(id == 0) ? 'Nowy użytkownik' : 'Użytkownik'"></span>
          <v-btn text icon @click="$emit('close-edit')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field label="E-mail" type="email" v-model="email" filled required :rules="emailRules" :change="emailBackendError = false" :loading="loading"></v-text-field>
            <v-text-field label="Hasło" :type="show1 ? 'text' : 'password'" v-model="passwd" filled :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show1 = !show1" :loading="loading"></v-text-field>
            <v-select
              v-model="id_group"
              :items="groups"
              item-text="name"
              item-value="id"
              label="Grupa robocza"
              required
              filled
              :rules="[v => !!v || 'Wybierz grupę dla użytkownika']"
              :loading="loading"
            ></v-select>
            <v-select
              v-model="state"
              :items="states"
              item-text="name"
              item-value="id"
              label="Status"
              required
              filled
              :loading="loading"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn x-large color="blue darken-1" text @click="$emit('close-edit')">Anuluj</v-btn>
          <v-btn x-large color="primary" @click="saveItem" :disabled="!valid || loading">Zapisz zmiany</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import cms from '../api/cms'
export default {
  props: ['id', 'dialog'],
  data: () => ({
    valid: true,
    loading: false,
    tableName: 'users',

    email: undefined,
    emailRules: [
      v => !!v || 'E-mail jest wymagany',
      v => /.+@.+\..+/.test(v) || 'E-mail jest nieprawidłowy',
    ],

    passwd: undefined,
    show1: false,
    passwordRules: [ 
      v => !!v || 'Password is required', 
      v => (v && v.length >= 5) || 'Password must have 5+ characters',
      v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
      v => /(?=.*\d)/.test(v) || 'Must have one number', 
      v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]' 
    ],
    //passwordRequired: value => !!value || "Your password is required",
    //passwordMatch: value => value === this.password || "Your passwords don't match",
    //min: v => v.length >= 14 || "Your password must be at least 14 characters",

    id_group: undefined,
    groups: [
      { id: 1, name: 'Administratorzy' },
      { id: 2, name: 'Redaktorzy' },
    ],

    state: '',
    states: [
      { id: 0, name: 'Nieaktywny', color: 'accent' },
      { id: 1, name: 'Aktywny', color: 'secondary' },
    ],
    stateRules: [
      v => !!v || 'Wybierz status użytkownika'
    ]
  }),
  computed: {
    
  },
  watch: {
    dialog: function (newVal) {
      if (newVal == true) {
        if (this.id != 0) {
          this.loadItem();
        }
      } else {
        this.$refs.form.reset();
      }
    }
  },
  methods: {
    loadItem() {
      this.loading = true;
      cms.getItem(this.tableName, this.id, {})
      .then(response => {
        if (response.id) {
          this.email = response.email;
          this.id_group = response.id_group;
          this.state = response.state;
        } else {
          this.$refs.form.reset();
        }
        this.loading = false;
      });
    },
    saveItem() {
      if (this.id == 0) {
        cms.create(this.tableName, {
          email: this.email,
          passwd: this.passwd,
          name: this.name,
          id_group: this.id_group,
          state: this.state
        })
        .then(response => {
          if (response.id) {
            this.$emit('edit-updated');
          } else {
            console.log('error');
          }
        });
      } else {
        cms.update(this.tableName, this.id, {
          id: this.id,
          email: this.email,
          passwd: this.passwd,
          name: this.name,
          id_group: this.id_group,
          state: this.state
        })
        .then(response => {
          if (response.id) {
            this.$emit('edit-updated');
          } else {
            console.log('error');
          }
        });
      }
      
    }
  }
}
</script>