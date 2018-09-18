def compose = "docker-compose -f docker-compose.yml -f docker-compose.test.yml -p votingapp"

pipeline {
  agent any
  options {
    timeout(time: 20, unit: 'MINUTES')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh "${compose} build --pull"
      }
    }

    stage('Test Backend (Mocha)') {
      steps {
        sh "${compose} run mocha"
      }
    }

    stage('Tag and Push Docker Images to DockerHub') {
      when {
        expression { env.BRANCH_NAME == 'master' }
      }

      steps {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker-login',
        usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
          // Login to Docker Registry
          sh "docker login -u ${USERNAME} -p ${PASSWORD}"
        }

        // Tag Docker Images
        sh "docker tag votingapp_frontend swapnil1992/votingapp_frontend"
        sh "docker tag votingapp_backend swapnil1992/votingapp_backend"

        // Push Docker Images
        sh "docker push swapnil1992/votingapp_frontend"
        sh "docker push swapnil1992/votingapp_backend"

        // Logout from Docker Registry
        sh "docker logout"
      }
    }

    stage('Upgrade Rancher Environment') {
      when {
        expression { env.BRANCH_NAME == 'master' }
      }

      steps {
        script {
          env.rancherHeaders = '-H "Content-Type: application/json" -X POST'

          env.rancherJSONFrontend = '{"push_data":{"tag":"latest"},"repository":{"repo_name":"swapnil1992/votingapp_frontend"}}'
           env.rancherURLFrontend = 'http://172.25.18.132:8081/v1-webhooks/endpoint?key=O2L1HEDlMaS70kKI1ZbUxxhVzgo5ZW3LmJAGJMJI&projectId=1a5'

          env.rancherJSONBackend = '{"push_data":{"tag":"latest"},"repository":{"repo_name":"swapnil1992/votingapp_backend"}}'
           env.rancherURLBackend = 'http://172.25.18.132:8081/v1-webhooks/endpoint?key=hI9cIQO8TMYNczkgLa49f9DR07RDCv2KzTwYYOW8&projectId=1a5'
        }

        sh "curl ${env.rancherHeaders} -d '${env.rancherJSONFrontend}' '${env.rancherURLFrontend}'"
        sh "curl ${env.rancherHeaders} -d '${env.rancherJSONBackend}' '${env.rancherURLBackend}'"
      }
    }
  }

  post {
    always {
      sh "${compose} down -v"
    }
  }
}
