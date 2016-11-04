<?php

namespace DSApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use DSApiBundle\Entity\User;


class SecurityController extends Controller
{
    public function signupAction(Request $req)
    {
        $data = json_decode($req->getContent(), true);
        
        $username  = $data['username'];
        $email     = $data['email'];
        $password  = $data['password'];
        
        $em = $this->getDoctrine()
                   ->getManager();
        
        $user = $em->getRepository('DSApiBundle:User')->findOneBy(['username' => $username]);
        
        if($user)
        {
          return new JsonResponse('USER_EXIST'); 
            
        }
        $user = new User();
        
        $encoder = $this->container->get('security.password_encoder');
        $_password = $encoder->encodePassword($user, $password);
       
     
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($_password);
        
        $em->persist($user);
        $em->flush();
        
        return new JsonResponse('OK');
        
        
    }
    
    public function signinAction(Request $req)
    {
        $data = json_decode($req->getContent(), true);
        $user = new User();
        
        $username  = $data['username'];
        $password  =   $data['password'];
        
        $encoder = $this->container->get('security.password_encoder');
        $_password = $encoder->encodePassword($user, $password);
            
        $em = $this->getDoctrine()
                   ->getManager();
        
        $user = $em->getRepository('DSApiBundle:User')
                   ->findOneBy(['username' => $username,
                                'password' => $_password
                               ]);
        
        if(!$user){
            return new JsonResponse('USER_NOT_FOUND');
        }
        
        
        $token = $this->get('lexik_jwt_authentication.encoder')
            ->encode([
                'username' => $username,
                'exp' => time() + 3600
            ]);
        
        return new JsonResponse(['token' => $token]);
    
    }
    public function homeAction(Request $req)
    { 
        $data = json_decode($req->getContent(), true);
        
        $username = $data['username'];
        $em = $this->getDoctrine()->getManager();
        
        $user = $em->getRepository('DSApiBundle:User')
                   ->findOneBy(['username' => $username]);
        
        $serializer = $this->get('serializer');
        
        $response =  ['username' => $user->getUsername(),
                      'email'  => $user->getEmail(),
                      'roles' =>$user->getRoles(),
                      'salt'=> $user->getSalt()
                     ];
        
        $json = $serializer->serialize($response, 'json', array());
        
        return new Response($json);
        
    }
    
    public function adminAction(Request $req)
    {
        $data = json_decode($req->getContent(), true);
        
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];
        
        $em = $this->getDoctrine()->getManager();
        
        $user = $em->getRepository('DSApiBundle:User')
                   ->findOneBy(['username' => $username]);
        
        if(!$user){
             return new JsonResponse('USER_NOT_FOUND');
        }
        
        $encoder = $this->container->get('security.password_encoder');
        $_password = $encoder->encodePassword($user, $password);
        
        $user->setEmail($email);
        $user->setPassword($_password);
        
        $em->persist($user);
        $em->flush();
        
        return new JsonResponse('OK');
        
    }
    
    
}