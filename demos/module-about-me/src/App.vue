<template>
  <div>
    <div style="border-bottom: 1px solid #ccc">
      <router-link class="a-link" to="/study">Study</router-link>
      <router-link class="a-link" to="/works">Works</router-link>
    </div>
    <div>
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
}

body {
  height: 100%;
}

.fr {
  display: flex;
}

.fi {
  flex: initial;
}

.ff {
  flex: 1;
}

.a-link {
  border: solid 1px #ccc;
  display: inline-block;
  padding: 6px;
  width: 180px;

  &:hover {
    color: white;
    background-color: goldenrod;
  }
}
</style>
