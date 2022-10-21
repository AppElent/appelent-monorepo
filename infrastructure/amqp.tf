resource "cloudamqp_instance" "amqp_shared" {
  name          = "amqp-appelent-shared"
  plan          = "lemur"
  region        = "google-compute-engine::europe-west1"
}

# data cloudamqp_instance instancetest {
#   instance_id = "24ce1216-5849-42fb-825e-15e97bb19c3c"
# }

# output cloudamqp_test {
#   value = data.cloudamqp_instance.instancetest.region
# }