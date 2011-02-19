Mytest::Application.routes.draw do

  #报表统计
  resources :reports do
    collection do
      get "index"
      get "sex_statis"
      get "age_statis"
      get "card_type_statis"
      get "sex_graph_code"
      get "age_graph_code"
      get "card_type_graph_code"
    end
  end

  resources :card_types do
    collection do
      get "show_card_type"
      post "show_card_type"
      post "create"
    end
  end

  #groups
  #get "groups/scaffold"
  #post 'groups/create'
  #post "groups/destroy"

  #用户小组
  resources :groups do
    collection do
      post "delete_all"
      post "create"
      post "destroy"
      get "scaffold"
      get "show_user_groups"
      post "show_user_groups"
    end
  end

  #log_users,用户登记信息记录
  resources :log_users do
    collection do
      get "index"
      post "index"
      post "create_log_user"
      get "create_log_user"
    end
  end
  
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
      post "create_user"
      #get "create_user"
      post "index"
      get "index"
      post "search_user"
      get "search_user"
      get "personality_detail"
      post "personality_detail"
      get "update_pw_win"
      post "update_pw"
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
