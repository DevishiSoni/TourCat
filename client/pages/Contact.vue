<script setup>
const email = "tourcat.support@gmail.com"
const subject = "TourCat Inquiry"
const body = "Hi TourCat team,%0D%0A%0D%0AI had a question about..."
</script>

<template>
  <div class="contact-page">
    <img src="/images/tourcat-removebg.png" alt="TourCat Logo" class="contact-logo" />
    <h2>Contact Us</h2>

    <p class="description">
      Have questions, feedback, or suggestions? We'd love to hear from you!
    </p>

    <!-- Contact Info -->
    <div class="contact-info">
      <p><strong>Email:</strong> {{ email }}</p>
    </div>

    <!-- Email Button -->
    <a
      :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`"
      target="_blank"
      class="email-btn"
    >
      Send Us an Email
    </a>

  </div>
</template>

<style scoped>
.contact-page {
  text-align: center;
  padding: 40px;
}

.contact-logo{
  height: 200px;
  width: auto;
  margin-bottom: 20px;
}

.description {
  margin-bottom: 20px;
  color: #666;
}

.contact-info {
  margin-bottom: 30px;
  font-size: 16px;
}

.email-btn {
  display: inline-block;
  padding: 14px 28px;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.2s;
}

.email-btn:hover {
  background-color: #0056b3;
}
</style>