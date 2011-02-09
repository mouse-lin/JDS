Mytest::Application.routes.draw do
  get "reports/index"
  resources :reports

  #groups
  get "groups/scaffold"
  post 'groups/create'
  post "groups/destroy"
  resources :groups

  #log_users
  resources :log_users
  
  #kindeditor
  get 'kindeditor/images_list'
  post 'kindeditor/upload'

  resources :user_parts do
    collection do 
      get "choose_image"
      get "show_image"
      get "show_kind"
      get "edit_user_part_index"
      post "update_image"
      post "create_user_part"
      post "index"
      get "index"
      post "search_user_parts"
      get "search_user_parts"
    end
  end

  #主页homes
  get "homes/index"

  #用户验证
  devise_for :users do
    get "login", :to => "devise/sessions#new" 
    get "signup", :to => "devise/registrations#create"
    get "logout", :to =>  "devise/sessions#destroy"
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "homes#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
