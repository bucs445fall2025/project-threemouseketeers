<script>
  export let data;
</script>

<div class="main-home">
<h1 style="text-align: center;">Welcome!</h1>

<p class="home-text">
  You are now verified with the email {data.user.email}. Click <a href='/'>here</a> to return home.
</p>
</div>

<style>
  .main-home {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1.5rem 2rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    align-items: center;
  }
  .home-text {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 700px;
    margin: 1.5rem auto;
    color: rgb(111, 111, 111);
    text-align: center;
    padding: 0 1rem;  
  }
</style>