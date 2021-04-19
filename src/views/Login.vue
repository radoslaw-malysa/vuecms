<template>
	<v-container
		class="fill-height"
		fluid
	>
		<v-row
			align="center"
			justify="center"
		>
			<v-col
				cols="12"
				sm="8"
				md="4"
			>
				<v-card flat class="no-bg">
					<v-card-text>
						<p class="display-1 text--primary">Blokpres</p>
						<v-alert
							border="left"
							type="error"
							transition="scale-transition"
							:value="error"
						>
							{{ errorMessage }}
						</v-alert>
						<v-form
							ref="form"
							v-model="valid"
							lazy-validation
						>
							<v-text-field
								v-model="email" 
								filled 
								required 
								:rules="emailRules"
								label="E-mail"
								name="email"
								prepend-inner-icon="person"
								type="text"
								:loading="loading"
							></v-text-field>
							<v-text-field 
								prepend-inner-icon="lock"
								label="Hasło" 
								:type="passType ? 'text' : 'password'" 
								v-model="passwd" 
								:rules="passwordRules"
								:append-icon="passType ? 'visibility' : 'visibility_off'" 
								@click:append="passType = !passType"
								required
								filled
								:loading="loading"
							></v-text-field>
						</v-form>
						<div class="text-right">
							<v-btn x-large   color="primary" @click="loginUser" :loading="loading">Zaloguj</v-btn>
						</div>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	data: () => ({
		valid: true,
		email: undefined,
		emailRules: [
			v => !!v || 'Podaj adres e-mail',
			v => /.+@.+\..+/.test(v) || 'E-mail jest nieprawidłowy',
		],
		passwd: undefined,
		passwordRules: [ v => !!v || 'Podaj hsło' ],
		passType: false,
		errorMessage: false
	}),
	computed: {
		...mapGetters('profile', ['profile', 'isLogged', 'loading']),
		error() {
			return (this.errorMessage) ? true : false
		}
	},
	created() {
    this.getSession()
    .then(() => {
			if (this.isLogged) {
        this.$router.push({ path: '/' })
      }
    });
  },
	methods: {
		...mapActions('profile', ['login', 'getSession']),
		loginUser() {
			if (this.$refs.form.validate()) {
				this.login({
					email: this.email,
					passwd: this.passwd
				})
				.then(data => {
					if (data.error) {
						this.errorMessage = data.message;
					} else {
						this.$router.push({ path: '/' })
					}
				});
			}
		}
	}
}
</script>

<style>
.esyfloresy {
  background-image: url(/img/bg.svg);
  background-size: 200vw;
  background-position: 40% 50%;
}
.v-card.no-bg {
	background-color: transparent !important;
}
</style>