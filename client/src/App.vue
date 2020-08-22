<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" style="margin-top: 30px;">
          <v-col cols="12" sm="8" md="4">
            <v-alert
              type="success"
              v-model="alertSuccess.active"
              elevation="2"
              dismissible
              close-icon="mdi-close"
            >
              Created
              <a :href="`${alertSuccess.url}`">{{ alertSuccess.url }}</a>
            </v-alert>

            <v-card class="elevation-12">
              <v-toolbar color="primary" flat>
                <v-toolbar-title class="white--text">
                  GNow — URL shorter
                  <v-chip class="ma-2" color="warning" small>Trash certified</v-chip>
                </v-toolbar-title>
              </v-toolbar>

              <v-card-text>
                <v-form v-model="validated" ref="form" @submit.prevent="createSlug()">
                  <v-text-field
                    label="URL"
                    outlined
                    v-model="url.input"
                    :error-messages="url.hasError ? 'Invalid URL' : null"
                    :rules="[required('URL'), validURL()]"
                    autocomplete="off"
                  ></v-text-field>
                  <v-text-field
                    label="Slug"
                    outlined
                    v-model="slug.input"
                    @input="slug.isFree = false; slug.isUsed = false;"
                    :success-messages="slug.isFree ? `The slug '${slug.input}' is free to claim.` : null"
                    :error-messages="slug.isUsed ? `This slug already exists.` : (slug.hasError ? 'Invalid Slug' : null)"
                    :rules="[required('Slug'), minLength(4)]"
                    autocomplete="off"
                  ></v-text-field>
                  <v-btn
                    type="submit"
                    rounded
                    color="primary"
                    :loading="loading"
                    :disabled="!validated"
                  >Create</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script src="./app.js"></script>
<style>
a {
  color: #fff !important;
  text-decoration: none;
  font-weight: 700;
}
a:hover {
  text-decoration: underline;
}
</style>