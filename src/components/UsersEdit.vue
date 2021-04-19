<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="justify-space-between pl-14">
        <span class="headline" v-text="(id == 0) ? 'Nowy użytkownik' : 'Użytkownik'"></span>
        <v-btn text icon @click="$emit('close-edit')">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field label="E-mail" type="email" v-model="email" filled required :rules="emailRules" :change="emailBackendError = false" :loading="loading" prepend-icon="alternate_email"></v-text-field>
          <v-text-field label="Hasło" :type="show1 ? 'text' : 'password'" v-model="passwd" filled :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show1 = !show1" :loading="loading" prepend-icon="password"></v-text-field>
          <v-select
            v-model="id_group"
            :items="config.usersGroups"
            item-text="title"
            item-value="id"
            label="Grupa robocza"
            required
            filled
            :rules="[v => !!v || 'Wybierz grupę dla użytkownika']"
            :loading="loading"
            prepend-icon="group"
          ></v-select>
          <v-select
            v-model="state"
            :items="config.usersStates"
            item-text="title"
            item-value="id"
            label="Status"
            required
            filled
            :loading="loading"
            prepend-icon="verified"
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
import { mapGetters } from 'vuex'
import cms from '../api/cms'
export default {
  props: ['id', 'dialog'],
  data: () => ({
    tableName: 'users',
    valid: true,
    loading: false,
    
    email: null,
    emailRules: [
      v => !!v || 'E-mail jest wymagany',
      v => /.+@.+\..+/.test(v) || 'E-mail jest nieprawidłowy',
    ],

    passwd: null,
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

    id_group: null,
    groups: [
      { id: 1, name: 'Administratorzy' },
      { id: 2, name: 'Redaktorzy' },
    ],

    state: '',
    stateRules: [
      v => !!v || 'Wybierz status użytkownika'
    ]
  }),
  computed: {
    ...mapGetters('config', ['config']),
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